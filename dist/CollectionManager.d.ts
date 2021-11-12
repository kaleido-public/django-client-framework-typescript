import { AbstractCollectionManager } from "./AbstractCollectionManager";
import type { Model } from "./Model";
import type { ObjectManager } from "./ObjectManager";
export declare class CollectionManager<T extends Model> extends AbstractCollectionManager<T> {
    T: new () => T;
    constructor(T: new () => T);
    get model_name(): string;
    get collection_url(): string;
    create(data: Partial<T>): Promise<ObjectManager<T>>;
    get_or_create({ query, defaults, }: {
        query: Partial<T>;
        defaults?: Partial<T>;
    }): Promise<ObjectManager<T>>;
    update_or_create({ query, defaults, }: {
        query: Partial<T>;
        defaults?: Partial<T>;
    }): Promise<ObjectManager<T>>;
}
//# sourceMappingURL=CollectionManager.d.ts.map