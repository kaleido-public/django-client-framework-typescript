export class Decodable {
    decode_json(data: Object): this {
        Object.assign(this, data)
        return this
    }

    static decode_json<T extends Decodable>(ctor: new () => T, data: Object): T {
        return new ctor().decode_json(data)
    }
}
