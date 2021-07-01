import { Model } from "./Model";
import { AbstractCollectionManager } from "./AbstractCollectionManager";
export declare class RelatedCollectionManager<T extends Model, P extends Model> extends AbstractCollectionManager<T> {
    parent_id: number;
    parent_key: string;
    parent_model_name: string;
    T: new () => T;
    constructor(T: new () => T, parent: P, parent_key: string);
    get collection_url(): string;
    add_ids(ids: number[]): Promise<void>;
    set_ids(ids: number[]): Promise<void>;
    remove_ids(ids: number[]): Promise<void>;
    add(objects: T[]): Promise<void>;
    set(objects: T[]): Promise<void>;
    remove(objects: T[]): Promise<void>;
}
//# sourceMappingURL=RelatedCollectionManager.d.ts.map