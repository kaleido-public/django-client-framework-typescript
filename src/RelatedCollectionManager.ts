import { Ajax } from "./AjaxDriver"
import { Model } from "./Model"
import { model_name } from "./helpers"
import { AbstractCollectionManager } from "./AbstractCollectionManager"

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
        this.parent_model_name = model_name(parent)
        this.parent_key = parent_key
        this.T = T
    }

    get collection_url(): string {
        return `/${this.parent_model_name}/${this.parent_id}/${this.parent_key}`
    }

    async add_ids(ids: number[]): Promise<void> {
        return Ajax.request_void("POST", this.collection_url, ids)
    }

    async set_ids(ids: number[]): Promise<void> {
        return Ajax.request_void("PATCH", this.collection_url, ids)
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
            "PATCH",
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
