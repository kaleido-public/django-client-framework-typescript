"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKeys = exports.collection_url = exports.object_url = exports.model_name = void 0;
var Model_1 = require("./Model");
function model_name(model) {
    if (model instanceof Model_1.Model) {
        return model.constructor.name.toLowerCase();
    }
    else {
        return model.name.toLowerCase();
    }
}
exports.model_name = model_name;
function object_url(T, id) {
    var object = new T();
    return "/" + model_name(object) + "/" + id;
}
exports.object_url = object_url;
function collection_url(T) {
    var object = new T();
    return "/" + model_name(object);
}
exports.collection_url = collection_url;
function getKeys(x) {
    return Object.keys(x);
}
exports.getKeys = getKeys;
//# sourceMappingURL=helpers.js.map