import type { ObjectManager } from "."
import { ObjectManagerImpl } from "."
import type { Model } from "./Model"

export class PageResult<T extends Model> {
    page: number = 0
    limit: number = 0
    pages_count: number = 0
    objects_count: number = 0
    objects: T[] = []

    get managers(): ObjectManager<T>[] {
        return this.objects.map((val) => new ObjectManagerImpl(val) as ObjectManager<T>)
    }
}
