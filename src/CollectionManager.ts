import { Ajax } from "./AjaxDriver"
import { Model } from "./Model"
import { ObjectManager, ObjectManagerImpl } from "./ObjectManager"
import { AbstractCollectionManager } from "./AbstractCollectionManager"

export class CollectionManager<T extends Model> extends AbstractCollectionManager<T> {
    T: new () => T
    constructor(T: new () => T) {
        super()
        this.T = T
    }

    get model_name(): string {
        let object = new this.T()
        return object._model_name.toLowerCase()
    }

    get collection_url(): string {
        return `/${this.model_name}`
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
        if (page.objects_count === 0) {
            return this.create({ ...query, ...defaults })
        } else if (page.objects_count === 1) {
            return new ObjectManagerImpl(page.objects[0]) as ObjectManager<T>
        } else {
            throw new Error(
                `.get() must receive exactly 1 object, but got ${page.objects_count}.`
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
        if (page.objects_count === 0) {
            return this.create({ ...query, ...defaults })
        } else if (page.objects_count === 1) {
            let manager = new ObjectManagerImpl(page.objects[0]) as ObjectManager<T>
            return manager.update(defaults)
            // return manager
        } else {
            throw new Error(
                `.get() must receive exactly 1 object, but got ${page.objects_count}.`
            )
        }
    }
}
