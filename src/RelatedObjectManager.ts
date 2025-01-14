import { NotFound } from "."
import { Ajax } from "./AjaxDriver"
import type { Model } from "./Model"
import type { ObjectManager } from "./ObjectManager"
import { ObjectManagerImpl } from "./ObjectManager"

export class RelatedObjectManager<T extends Model, P extends Model> {
    parent_id: number | string
    parent_key: string
    parent_model_name: string
    T: new () => T
    constructor(T: new () => T, parent: P, parent_key: string) {
        this.parent_id = parent.id
        this.parent_model_name = parent._model_name.toLowerCase()
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
        } catch (error: any) {
            if (error instanceof NotFound) {
                return null
            } else {
                throw error
            }
        }
    }

    async set(val: T): Promise<void> {
        return Ajax.request_void("PATCH", this.object_url, val.id)
    }
}
