import { ObjectManager } from ".";
import { Model } from "./Model";
export declare class PageResult<T extends Model> {
    page: number;
    limit: number;
    total: number;
    previous: string;
    next: string;
    objects: T[];
    get managers(): ObjectManager<T>[];
}
//# sourceMappingURL=PageResult.d.ts.map