import { Model } from "./Model";
export declare type ObjectManager<T extends Model> = ObjectManagerImpl<T> & T;
export declare class ObjectManagerImpl<T extends Model> {
    original: T;
    updated: T;
    T: new () => T;
    constructor(model: T);
    get model_name(): string;
    get object_url(): string;
    delete(): Promise<void>;
    refresh(): Promise<void>;
    save(): Promise<void>;
    update(data: Partial<T>): Promise<this>;
    get model(): Model;
}
//# sourceMappingURL=ObjectManager.d.ts.map