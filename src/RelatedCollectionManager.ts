import { Ajax } from "./AjaxDriver"
import { Model } from "./Model"
import { AbstractCollectionManager } from "./AbstractCollectionManager"

export class RelatedCollectionManager<
    T extends Model,
    P extends Model
> extends AbstractCollectionManager<T> {
    parent_id: number | string
    parent_key: string
    parent_model_name: string
    T: new () => T
    constructor(T: new () => T, parent: P, parent_key: string) {
        super()
        this.parent_id = parent.id
        this.parent_model_name = parent._model_name.toLocaleLowerCase()
        this.parent_key = parent_key
        this.T = T
    }

    get collection_url(): string {
        return `/${this.parent_model_name}/${this.parent_id}/${this.parent_key}`
    }

    async add_ids(ids: (number | string)[]): Promise<void> {
        return Ajax.request_void("POST", this.collection_url, ids)
    }

    async set_ids(ids: (number | string)[]): Promise<void> {
        return Ajax.request_void("PATCH", this.collection_url, ids)
    }

    async remove_ids(ids: (number | string)[]): Promise<void> {
        return Ajax.request_void("DELETE", this.collection_url, ids)
    }

    async add(objects: T[]): Promise<void> {
        return this.add_ids(objects.map((val) => val.id))
    }

    async set(objects: T[]): Promise<void> {
        return this.set_ids(objects.map((val) => val.id))
    }

    async remove(objects: T[]): Promise<void> {
        return this.remove_ids(objects.map((val) => val.id))
    }
}
