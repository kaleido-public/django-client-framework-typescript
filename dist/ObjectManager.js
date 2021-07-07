"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectManagerImpl = void 0;
var AjaxDriver_1 = require("./AjaxDriver");
var helpers_1 = require("./helpers");
var ObjectManagerImpl = (function () {
    function ObjectManagerImpl(model) {
        this.T = model.constructor;
        this.original = Object.assign(new this.T(), model);
        this.updated = model;
        return new Proxy(this, {
            get: function (target, key, receiver) {
                if (key in target.updated) {
                    return target.updated[key];
                }
                else if (key in target.original) {
                    return target.original[key];
                }
                else {
                    return Reflect.get(target, key, receiver);
                }
            },
            set: function (target, key, value, receiver) {
                if (target.hasOwnProperty(key)) {
                    return Reflect.set(target, key, value, receiver);
                }
                else {
                    target.updated[key] = value;
                    return true;
                }
            },
        });
    }
    Object.defineProperty(ObjectManagerImpl.prototype, "model_name", {
        get: function () {
            return this.model._model_name.toLowerCase();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ObjectManagerImpl.prototype, "object_url", {
        get: function () {
            return "/" + this.model_name + "/" + this.original.id;
        },
        enumerable: false,
        configurable: true
    });
    ObjectManagerImpl.prototype.delete = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, AjaxDriver_1.Ajax.request_void("DELETE", this.object_url, {})];
            });
        });
    };
    ObjectManagerImpl.prototype.refresh = function () {
        return __awaiter(this, void 0, void 0, function () {
            var model;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, AjaxDriver_1.Ajax.request_decode(this.T, "GET", this.object_url, {})];
                    case 1:
                        model = _a.sent();
                        this.original = model;
                        this.updated = model;
                        return [2];
                }
            });
        });
    };
    ObjectManagerImpl.prototype.save = function () {
        return __awaiter(this, void 0, void 0, function () {
            var to_send, _a, _b, key, a, b, model;
            var e_1, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        to_send = {};
                        try {
                            for (_a = __values(helpers_1.getKeys(this.updated)), _b = _a.next(); !_b.done; _b = _a.next()) {
                                key = _b.value;
                                a = this.updated[key];
                                b = this.original[key];
                                if (a != b) {
                                    to_send[key] = a;
                                }
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                        return [4, AjaxDriver_1.Ajax.request_decode(this.T, "PATCH", this.object_url, to_send)];
                    case 1:
                        model = _d.sent();
                        this.original = Object.assign(new this.T(), model);
                        this.updated = model;
                        return [2];
                }
            });
        });
    };
    ObjectManagerImpl.prototype.update = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var model;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, AjaxDriver_1.Ajax.request_decode(this.T, "PATCH", this.object_url, data)];
                    case 1:
                        model = _a.sent();
                        this.original = Object.assign(new this.T(), model);
                        this.updated = model;
                        return [2, this];
                }
            });
        });
    };
    Object.defineProperty(ObjectManagerImpl.prototype, "model", {
        get: function () {
            return this.updated;
        },
        enumerable: false,
        configurable: true
    });
    return ObjectManagerImpl;
}());
exports.ObjectManagerImpl = ObjectManagerImpl;
//# sourceMappingURL=ObjectManager.js.map