import { Ajax } from "./AjaxDriver"
import { model_name } from "./helpers"
import { Model } from "./Model"
import { ObjectManager, ObjectManagerImpl } from "./ObjectManager"

export class RelatedObjectManager<T extends Model, P extends Model> {
    parent_id: number
    parent_key: string
    parent_model_name: string
    T: new () => T
    constructor(T: new () => T, parent: P, parent_key: string) {
        this.parent_id = parent.id
        this.parent_model_name = model_name(parent)
        this.parent_key = parent_key
        this.T = T
    }

    private get object_url(): string {
        return `/${this.parent_model_name}/${this.parent_id}/${this.parent_key}`
    }

    async get(): Promise<ObjectManager<T> | null> {
        try {
            let model = await Ajax.request_decode(this.T, "GET", this.object_url)
            return new ObjectManagerImpl<T>(model) as any
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
