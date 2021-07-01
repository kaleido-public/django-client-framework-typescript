import { Model } from "./Model";
export declare function model_name(model: Model | (new () => Model)): string;
export declare function object_url(T: new () => Model, id: number): string;
export declare function collection_url(T: new () => Model): string;
export declare function getKeys<T>(x: T): (keyof T)[];
//# sourceMappingURL=helpers.d.ts.map