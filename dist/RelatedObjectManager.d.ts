import type { Model } from "./Model";
import type { ObjectManager } from "./ObjectManager";
export declare class RelatedObjectManager<T extends Model, P extends Model> {
    parent_id: number | string;
    parent_key: string;
    parent_model_name: string;
    T: new () => T;
    constructor(T: new () => T, parent: P, parent_key: string);
    private get object_url();
    get(): Promise<ObjectManager<T> | null>;
    set(val: T): Promise<void>;
}
//# sourceMappingURL=RelatedObjectManager.d.ts.map