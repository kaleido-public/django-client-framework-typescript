import { ObjectManager } from ".";
import { Model } from "./Model";
export declare class PageResult<T extends Model> {
    page: number;
    limit: number;
    pages_count: number;
    objects_count: number;
    objects: T[];
    get managers(): ObjectManager<T>[];
}
//# sourceMappingURL=PageResult.d.ts.map