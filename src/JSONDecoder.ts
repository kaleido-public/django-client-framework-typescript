import { Model } from "./Model"

interface JSONDecoderInterface {
    decode_model<T extends Model>(T: new () => T, json: Object): T
}

class SimpleJSONDecoder implements JSONDecoderInterface {
    decode_model<T extends Model>(T: new () => T, json: Object): T {
        let model = new T()
        Object.assign(model, json)
        return model
    }
}

export const JSONDecoder = new SimpleJSONDecoder()
