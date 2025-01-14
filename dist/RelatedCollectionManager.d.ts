import { AbstractCollectionManager } from "./AbstractCollectionManager";
import type { Model } from "./Model";
export declare class RelatedCollectionManager<T extends Model, P extends Model> extends AbstractCollectionManager<T> {
    parent_id: number | string;
    parent_key: string;
    parent_model_name: string;
    T: new () => T;
    constructor(T: new () => T, parent: P, parent_key: string);
    get collection_url(): string;
    add_ids(ids: (number | string)[]): Promise<void>;
    set_ids(ids: (number | string)[]): Promise<void>;
    remove_ids(ids: (number | string)[]): Promise<void>;
    add(objects: T[]): Promise<void>;
    set(objects: T[]): Promise<void>;
    remove(objects: T[]): Promise<void>;
}
//# sourceMappingURL=RelatedCollectionManager.d.ts.map