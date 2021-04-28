import { Ajax } from "./AjaxDriver"
import { Model } from "./Model"

export function model_name(model: Model | (new () => Model)) {
    if (model instanceof Model) {
        return model._model_name
    } else {
        return new model()._model_name
    }
}

export function object_url(T: new () => Model, id: number) {
    let object = new T()
    return Ajax.url_prefix + model_name(object) + `/${id}`
}

export function collection_url(T: new () => Model) {
    let object = new T()
    return Ajax.url_prefix + model_name(object)
}

export function getKeys<T>(x: T): (keyof T)[] {
    return Object.keys(x) as (keyof T)[]
}
