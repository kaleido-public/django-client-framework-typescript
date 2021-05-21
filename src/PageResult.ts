import { ObjectManager, ObjectManagerImpl } from "."
import { Model } from "./Model"

export class PageResult<T extends Model> {
    page: number = 0
    limit: number = 0
    total: number = 0
    previous: string = ""
    next: string = ""
    objects: T[] = []

    get managers(): ObjectManager<T>[] {
        return this.objects.map((val) => new ObjectManagerImpl(val) as ObjectManager<T>)
    }
}
