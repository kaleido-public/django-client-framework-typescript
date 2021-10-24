"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ajax = exports.AjaxError = exports.AjaxDriverLogger = void 0;
var axios_1 = __importDefault(require("axios"));
var qs = __importStar(require("qs"));
var JSONDecoder_1 = require("./JSONDecoder");
var PageResult_1 = require("./PageResult");
var loglevel_1 = require("loglevel");
var log = loglevel_1.getLogger("AjaxDriver.ts");
exports.AjaxDriverLogger = log;
var REQUEST_ID = 0;
var AjaxError = (function () {
    function AjaxError(axioError) {
        this.axioError = axioError;
    }
    Object.defineProperty(AjaxError.prototype, "json", {
        get: function () {
            var _a;
            return (_a = this.axioError.response) === null || _a === void 0 ? void 0 : _a.data;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AjaxError.prototype, "status", {
        get: function () {
            var _a;
            return (_a = this.axioError.response) === null || _a === void 0 ? void 0 : _a.status;
        },
        enumerable: false,
        configurable: true
    });
    return AjaxError;
}());
exports.AjaxError = AjaxError;
var AxiosAjaxDriver = (function () {
    function AxiosAjaxDriver() {
        this.global_target_holder = {};
    }
    Object.defineProperty(AxiosAjaxDriver.prototype, "global_target", {
        get: function () {
            if (typeof window == "undefined") {
                return this.global_target_holder;
            }
            else {
                return window;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AxiosAjaxDriver.prototype, "additional_headers", {
        get: function () {
            return this.global_target["additional_headers"] || {};
        },
        set: function (val) {
            this.global_target["additional_headers"] = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AxiosAjaxDriver.prototype, "auth_token", {
        get: function () {
            return this.global_target["auth_token"] || "";
        },
        set: function (val) {
            this.global_target["auth_token"] = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AxiosAjaxDriver.prototype, "url_prefix", {
        get: function () {
            return this.global_target["url_prefix"] || "";
        },
        set: function (val) {
            this.global_target["url_prefix"] = val;
        },
        enumerable: false,
        configurable: true
    });
    AxiosAjaxDriver.prototype.get_headers = function () {
        var headers = __assign({ "content-type": "application/json; charset=UTF-8" }, this.additional_headers);
        if (this.auth_token) {
            headers = __assign({ Authorization: "Token " + this.auth_token }, headers);
        }
        return headers;
    };
    AxiosAjaxDriver.prototype.request = function (method, url, data) {
        var _a;
        if (data === void 0) { data = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var current_request_id, request, response, error_1, axioError;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        current_request_id = REQUEST_ID++;
                        url = this.url_prefix + url;
                        log.debug("AxiosAjaxDriver sent", current_request_id, method, url, data);
                        request = {
                            url: url,
                            method: method,
                            headers: this.get_headers(),
                            timeout: 30 * 1000,
                            paramsSerializer: function (params) {
                                return qs.stringify(params, { arrayFormat: "brackets" });
                            },
                        };
                        if (typeof data == "string") {
                            data = JSON.stringify(data);
                        }
                        if (method == "GET") {
                            request = __assign(__assign({}, request), { params: data });
                        }
                        else {
                            request = __assign(__assign({}, request), { data: data });
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4, axios_1.default(request)];
                    case 2:
                        response = _b.sent();
                        log.debug("AxiosAjaxDriver received", current_request_id, response.status, response.statusText, response.data);
                        return [2, response.data];
                    case 3:
                        error_1 = _b.sent();
                        axioError = error_1;
                        log.warn("AxiosAjaxDriver received error", current_request_id, (_a = axioError.response) === null || _a === void 0 ? void 0 : _a.data);
                        throw new AjaxError(error_1);
                    case 4: return [2];
                }
            });
        });
    };
    AxiosAjaxDriver.prototype.request_decode = function (T, method, url, data) {
        if (data === void 0) { data = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.request(method, url, data)];
                    case 1:
                        response = _a.sent();
                        return [2, JSONDecoder_1.JSONDecoder.decode_model(T, response)];
                }
            });
        });
    };
    AxiosAjaxDriver.prototype.request_decode_page = function (T, method, url, data) {
        if (data === void 0) { data = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var response, page;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.request(method, url, data)];
                    case 1:
                        response = _a.sent();
                        page = new PageResult_1.PageResult();
                        Object.assign(page, response);
                        if ("objects" in response) {
                            page.objects = response["objects"].map(function (val) {
                                return JSONDecoder_1.JSONDecoder.decode_model(T, val);
                            });
                            return [2, page];
                        }
                        else {
                            throw Error("Server did not return objects. Response: " + JSON.stringify(response));
                        }
                        return [2];
                }
            });
        });
    };
    AxiosAjaxDriver.prototype.request_void = function (method, url, data) {
        if (data === void 0) { data = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.request(method, url, data)];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    return AxiosAjaxDriver;
}());
exports.Ajax = new AxiosAjaxDriver();
//# sourceMappingURL=AjaxDriver.js.map