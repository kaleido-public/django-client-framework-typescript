import { Ajax } from "./ajax_drivers"
import { Decodable } from "./Decodable"

type ValidPropertyType = number | string | boolean | ValidPropertyType[]
type QueryParams<T> = { [k: string]: ValidPropertyType } | Partial<T>

function getKeys<T>(x: T): (keyof T)[] {
    return Object.keys(x) as (keyof T)[]
}

export abstract class Model extends Decodable {
    readonly id: number = -1

    constructor(data?: Object) {
        super()
        if (data) {
            Object.assign(this, data)
        }
    }

    get model_name(): string {
        return this.constructor.name.toLowerCase()
    }

    get manager(): ObjectManager<this> {
        return new ObjectManagerImpl(this) as any
    }

    copy(): this {
        return Object.create(this)
    }
}

export class PageResult<T extends Model> {
    page: number = 0
    limit: number = 0
    total: number = 0
    previous: string = ""
    next: string = ""
    objects: T[] = []

    get managers(): ObjectManager<T>[] {
        return this.objects.map((val) => val.manager)
    }
}

export interface PageQuery {
    page?: number
    limit?: number
    order_by?: string
}

export function object_url(T: new () => Model, id: number) {
    let object = new T()
    return `/api/v1/${object.model_name}/${id}`
}

export function collection_url(T: new () => Model) {
    let object = new T()
    return `/api/v1/${object.model_name}`
}

export type ObjectManager<T extends Model> = ObjectManagerImpl<T> & T

export class ObjectManagerImpl<T extends Model> {
    model: T
    updated: T
    T: new () => T

    constructor(object: T) {
        this.model = object.copy()
        this.updated = object.copy()
        this.T = object.constructor as new () => T
        return new Proxy(this, {
            get(target: ObjectManagerImpl<T>, key: keyof T, receiver) {
                if (target.updated[key] !== undefined) {
                    return target.updated[key]
                } else if (target.model[key] !== undefined) {
                    return target.model[key]
                } else {
                    return Reflect.get(target, key, receiver)
                }
            },
            set(target: ObjectManagerImpl<T>, key: keyof T, value, receiver) {
                if (target.hasOwnProperty(key)) {
                    return Reflect.set(target, key, value, receiver)
                } else {
                    target.updated[key] = value
                    return true
                }
            },
        })
    }

    get object_url(): string {
        return `/api/v1/${this.model.model_name}/${this.model.id}`
    }

    async delete(): Promise<void> {
        return Ajax.request_void("DELETE", this.object_url, {})
    }

    async get(): Promise<void> {
        const object = await Ajax.request_decode(this.T, "GET", this.object_url, {})
        this.model = object
    }

    async save(): Promise<void> {
        const to_send: Partial<T> = {}
        for (const key of getKeys(this.updated)) {
            const a = this.updated[key]
            const b = this.model[key]
            if (a != b) {
                to_send[key] = a
            }
        }

        let object = await Ajax.request_decode(
            this.T,
            "PATCH",
            this.object_url,
            to_send
        )

        this.model = object
    }

    async update(data: Partial<T>): Promise<this> {
        let model = await Ajax.request_decode(this.T, "PATCH", this.object_url, data)
        this.model = model
        return this
    }
}

abstract class AbstractCollectionManager<T extends Model> {
    abstract get collection_url(): string
    abstract get T(): new () => T

    async page({
        query = {},
        page = {},
    }: {
        query?: QueryParams<T>
        page?: PageQuery
    }): Promise<PageResult<T>> {
        let to_send: any = query
        for (let key of getKeys(page)) {
            to_send[`_${key}`] = page[key]
        }
        return Ajax.request_decode_page(this.T, "GET", this.collection_url, to_send)
    }

    async get(query: QueryParams<T>): Promise<ObjectManager<T>> {
        const page = await this.page({ query: query, page: { limit: 2 } })
        if (page.total !== 1) {
            throw new Error(
                `.get() must receive exactly 1 object, but got ${page.total}`
            )
        }
        return page.objects[0].manager
    }
}

export class CollectionManager<T extends Model> extends AbstractCollectionManager<T> {
    private model_name: string
    T: new () => T
    constructor(T: new () => T) {
        super()
        this.T = T
        this.model_name = new T().model_name
    }

    get collection_url(): string {
        return `/api/v1/${this.model_name}`
    }

    async create(data: Partial<T>): Promise<ObjectManager<T>> {
        let object = await Ajax.request_decode(
            this.T,
            "POST",
            this.collection_url,
            data
        )
        return object.manager
    }

    async get_or_create({
        query,
        defaults = {},
    }: {
        query: Partial<T>
        defaults?: Partial<T>
    }): Promise<ObjectManager<T>> {
        let page = await this.page({ query: query, page: { limit: 2 } })
        if (page.total === 0) {
            return this.create({ ...query, ...defaults })
        } else if (page.total === 1) {
            return page.objects[0].manager
        } else {
            throw new Error(
                `.get() must receive exactly 1 object, but got ${page.total}`
            )
        }
    }

    async update_or_create({
        query,
        defaults = {},
    }: {
        query: Partial<T>
        defaults?: Partial<T>
    }): Promise<ObjectManager<T>> {
        let page = await this.page({ query: query, page: { limit: 2 } })
        if (page.total === 0) {
            return this.create({ ...query, ...defaults })
        } else if (page.total === 1) {
            return page.objects[0].manager.update(defaults)
        } else {
            throw new Error(
                `.get() must receive exactly 1 object, but got ${page.total}`
            )
        }
    }
}

export class RelatedObjectManager<T extends Model, P extends Model> {
    parent_id: number
    parent_key: string
    parent_model_name: string
    T: new () => T
    constructor(T: new () => T, parent: P, parent_key: string) {
        this.parent_id = parent.id
        this.parent_model_name = parent.model_name
        this.parent_key = parent_key
        this.T = T
    }

    private get object_url(): string {
        return `/api/v1/${this.parent_model_name}/${this.parent_id}/${this.parent_key}`
    }

    async get(): Promise<ObjectManager<T> | null> {
        try {
            let model = await Ajax.request_decode(this.T, "GET", this.object_url)
            return model.manager
        } catch (error) {
            if (error.status === 404) {
                return null
            } else {
                throw error
            }
        }
    }

    async set(val: T): Promise<void> {
        return Ajax.request_void("PATCH", this.object_url, {
            [this.parent_key]: val.id,
        })
    }
}

export class RelatedCollectionManager<
    T extends Model,
    P extends Model
> extends AbstractCollectionManager<T> {
    parent_id: number
    parent_key: string
    parent_model_name: string
    T: new () => T
    constructor(T: new () => T, parent: P, parent_key: string) {
        super()
        this.parent_id = parent.id
        this.parent_model_name = parent.model_name
        this.parent_key = parent_key
        this.T = T
    }

    get collection_url(): string {
        return `/api/v1/${this.parent_model_name}/${this.parent_id}/${this.parent_key}`
    }

    async add_ids(ids: number[]): Promise<void> {
        return Ajax.request_void("POST", this.collection_url, ids)
    }

    async set_ids(ids: number[]): Promise<void> {
        return Ajax.request_void("PUT", this.collection_url, ids)
    }

    async remove_ids(ids: number[]): Promise<void> {
        return Ajax.request_void("DELETE", this.collection_url, ids)
    }

    async add(objects: T[]): Promise<void> {
        return Ajax.request_void(
            "POST",
            this.collection_url,
            objects.map((val) => val.id)
        )
    }

    async set(objects: T[]): Promise<void> {
        return Ajax.request_void(
            "PUT",
            this.collection_url,
            objects.map((val) => val.id)
        )
    }

    async remove(objects: T[]): Promise<void> {
        return Ajax.request_void(
            "DELETE",
            this.collection_url,
            objects.map((val) => val.id)
        )
    }
}
