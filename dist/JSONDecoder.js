"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONDecoder = void 0;
var SimpleJSONDecoder = (function () {
    function SimpleJSONDecoder() {
    }
    SimpleJSONDecoder.prototype.decode_model = function (T, json) {
        var model = new T();
        Object.assign(model, json);
        return model;
    };
    return SimpleJSONDecoder;
}());
exports.JSONDecoder = new SimpleJSONDecoder();
//# sourceMappingURL=JSONDecoder.js.map