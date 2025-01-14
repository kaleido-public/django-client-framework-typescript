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
exports.AbstractCollectionManager = void 0;
var _1 = require(".");
var AjaxDriver_1 = require("./AjaxDriver");
var helpers_1 = require("./helpers");
var ObjectManager_1 = require("./ObjectManager");
var AbstractCollectionManager = (function () {
    function AbstractCollectionManager() {
    }
    AbstractCollectionManager.prototype.page = function (_a) {
        var _b = _a.query, query = _b === void 0 ? {} : _b, _c = _a.page, page = _c === void 0 ? {} : _c;
        return __awaiter(this, void 0, void 0, function () {
            var to_send, _d, _e, key, val, key_any, _f, _g, key;
            var e_1, _h, e_2, _j;
            return __generator(this, function (_k) {
                to_send = {};
                try {
                    for (_d = __values(helpers_1.getKeys(query)), _e = _d.next(); !_e.done; _e = _d.next()) {
                        key = _e.value;
                        val = query[key];
                        if (Array.isArray(val) && val.length == 0) {
                            val = [null];
                        }
                        key_any = key;
                        if (val == null) {
                            key_any += "__isnull";
                            val = true;
                        }
                        to_send[key_any] = val;
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_e && !_e.done && (_h = _d.return)) _h.call(_d);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                try {
                    for (_f = __values(helpers_1.getKeys(page)), _g = _f.next(); !_g.done; _g = _f.next()) {
                        key = _g.value;
                        to_send["_" + key] = page[key];
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_g && !_g.done && (_j = _f.return)) _j.call(_f);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                return [2, AjaxDriver_1.Ajax.request_decode_page(this.T, "GET", this.collection_url, to_send)];
            });
        });
    };
    AbstractCollectionManager.prototype.get = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var page;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.page({ query: query, page: { limit: 2 } })];
                    case 1:
                        page = _a.sent();
                        if (page.objects_count == 0) {
                            throw new _1.NotFound();
                        }
                        else if (page.objects_count > 1) {
                            throw new _1.ProgrammingError(".get() must receive exactly 1 object, but got " + page.objects_count + ".");
                        }
                        return [2, new ObjectManager_1.ObjectManagerImpl(page.objects[0])];
                }
            });
        });
    };
    return AbstractCollectionManager;
}());
exports.AbstractCollectionManager = AbstractCollectionManager;
//# sourceMappingURL=AbstractCollectionManager.js.map