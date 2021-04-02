import { Model } from "./Model"

export function model_name(model: Model | (new () => Model)) {
    if (model instanceof Model) {
        return model.constructor.name.toLowerCase()
    } else {
        return model.name.toLowerCase()
    }
}

export function object_url(T: new () => Model, id: number) {
    let object = new T()
    return `/${model_name(object)}/${id}`
}

export function collection_url(T: new () => Model) {
    let object = new T()
    return `/${model_name(object)}`
}

export function getKeys<T>(x: T): (keyof T)[] {
    return Object.keys(x) as (keyof T)[]
}
