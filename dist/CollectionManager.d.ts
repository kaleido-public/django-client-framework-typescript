import { Model } from "./Model";
import { ObjectManager } from "./ObjectManager";
import { AbstractCollectionManager } from "./AbstractCollectionManager";
export declare class CollectionManager<T extends Model> extends AbstractCollectionManager<T> {
    T: new () => T;
    constructor(T: new () => T);
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