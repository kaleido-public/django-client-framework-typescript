import { Ajax } from "./AjaxDriver"
import { getKeys } from "./helpers"
import { Model } from "./Model"

export type ObjectManager<T extends Model> = ObjectManagerImpl<T> & T

export class ObjectManagerImpl<T extends Model> {
    original: T
    updated: T
    T: new () => T

    constructor(model: T) {
        this.T = model.constructor as new () => T
        this.original = Object.assign(new this.T(), model)
        this.updated = model
        return new Proxy(this, {
            get(target: ObjectManagerImpl<T>, key: string & keyof T, receiver) {
                if (key in target.updated) {
                    return target.updated[key]
                } else if (key in target.original) {
                    return target.original[key]
                } else {
                    return Reflect.get(target, key, receiver)
                }
            },
            set(target: ObjectManagerImpl<T>, key: string & keyof T, value, receiver) {
                if (target.hasOwnProperty(key)) {
                    return Reflect.set(target, key, value, receiver)
                } else {
                    target.updated[key] = value
                    return true
                }
            },
        })
    }

    get model_name(): string {
        return this.model._model_name.toLowerCase()
    }

    get object_url(): string {
        return `/${this.model_name}/${this.original.id}`
    }

    async delete(): Promise<void> {
        return Ajax.request_void("DELETE", this.object_url, {})
    }

    async refresh(): Promise<void> {
        const model = await Ajax.request_decode(this.T, "GET", this.object_url, {})
        this.original = model
        this.updated = model
    }

    async save(): Promise<void> {
        const to_send: Partial<T> = {}
        for (const key of getKeys(this.updated)) {
            const a = this.updated[key]
            const b = this.original[key]
            if (a != b) {
                to_send[key] = a
            }
        }

        let model = await Ajax.request_decode(this.T, "PATCH", this.object_url, to_send)

        this.original = Object.assign(new this.T(), model)
        this.updated = model
    }

    async update(data: Partial<T>): Promise<this> {
        let model = await Ajax.request_decode(this.T, "PATCH", this.object_url, data)
        this.original = Object.assign(new this.T(), model)
        this.updated = model
        return this
    }

    get model(): T {
        return this.updated
    }
}
