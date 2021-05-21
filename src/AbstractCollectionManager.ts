import { Ajax } from "./AjaxDriver"
import { getKeys } from "./helpers"
import { Model } from "./Model"
import { ObjectManager, ObjectManagerImpl } from "./ObjectManager"
import { PageResult } from "./PageResult"
import { PageQuery } from "./query"

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
        let to_send: any = query
        for (let key of getKeys(page)) {
            to_send[`_${key}`] = page[key]
        }
        return Ajax.request_decode_page(this.T, "GET", this.collection_url, to_send)
    }

    async get(query: QueryParams<T>): Promise<ObjectManager<T>> {
        const page = await this.page({ query: query, page: { limit: 2 } })
        if (page.total !== 1) {
            throw new Error(
                `.get() must receive exactly 1 object, but got ${page.total}.`
            )
        }
        return new ObjectManagerImpl(page.objects[0]) as ObjectManager<T>
    }
}
