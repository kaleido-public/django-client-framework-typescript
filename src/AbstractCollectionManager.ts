import { NotFound, ProgrammingError } from "."
import { Ajax } from "./AjaxDriver"
import { getKeys } from "./helpers"
import type { Model } from "./Model"
import type { ObjectManager } from "./ObjectManager"
import { ObjectManagerImpl } from "./ObjectManager"
import type { PageResult } from "./PageResult"
import type { PageQuery } from "./query"

type ValidPropertyType = number | string | boolean | ValidPropertyType[]
type QueryParams<T> = { [k: string]: ValidPropertyType } | Partial<T>

export abstract class AbstractCollectionManager<T extends Model> {
    abstract get collection_url(): string
    abstract get T(): new () => T

    async page({
        query = {},
        page = {},
    }: {
        query?: QueryParams<T>
        page?: PageQuery
    }): Promise<PageResult<T>> {
        let to_send: any = {}
        for (let key of getKeys(query)) {
            let val: any = query[key]
            if (Array.isArray(val) && val.length == 0) {
                val = [null] // the qs.stringify function requires the empty array to be passed as [null]
            }
            let key_any: any = key
            if (val == null) {
                // translates something like {foo: null} to {foo__isnull: true}
                key_any += "__isnull"
                val = true
            }
            to_send[key_any] = val
        }
        for (let key of getKeys(page)) {
            to_send[`_${key}`] = page[key]
        }
        return Ajax.request_decode_page(this.T, "GET", this.collection_url, to_send)
    }

    async get(query: QueryParams<T>): Promise<ObjectManager<T>> {
        const page = await this.page({ query: query, page: { limit: 2 } })
        if (page.objects_count == 0) {
            throw new NotFound()
        } else if (page.objects_count > 1) {
            throw new ProgrammingError(
                `.get() must receive exactly 1 object, but got ${page.objects_count}.`
            )
        }
        return new ObjectManagerImpl(page.objects[0]) as ObjectManager<T>
    }
}
