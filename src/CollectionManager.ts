import { Ajax } from "./AjaxDriver"
import { Model } from "./Model"
import { model_name } from "./helpers"
import { ObjectManager, ObjectManagerImpl } from "./ObjectManager"
import { AbstractCollectionManager } from "./AbstractCollectionManager"

export class CollectionManager<T extends Model> extends AbstractCollectionManager<T> {
    T: new () => T
    constructor(T: new () => T) {
        super()
        this.T = T
    }

    get collection_url(): string {
        return `/${model_name(this.T)}`
    }

    async create(data: Partial<T>): Promise<ObjectManager<T>> {
        let object = await Ajax.request_decode(
            this.T,
            "POST",
            this.collection_url,
            data
        )
        return new ObjectManagerImpl(object) as ObjectManager<T>
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
            return new ObjectManagerImpl(page.objects[0]) as ObjectManager<T>
        } else {
            throw new Error(
                `.get() must receive exactly 1 object, but got ${page.total}.`
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
            let manager = new ObjectManagerImpl(page.objects[0]) as ObjectManager<T>
            return manager.update(defaults)
            // return manager
        } else {
            throw new Error(
                `.get() must receive exactly 1 object, but got ${page.total}.`
            )
        }
    }
}
