import { Model } from "./Model";
interface JSONDecoderInterface {
    decode_model<T extends Model>(T: new () => T, json: Object): T;
}
declare class SimpleJSONDecoder implements JSONDecoderInterface {
    decode_model<T extends Model>(T: new () => T, json: Object): T;
}
export declare const JSONDecoder: SimpleJSONDecoder;
export {};
//# sourceMappingURL=JSONDecoder.d.ts.map