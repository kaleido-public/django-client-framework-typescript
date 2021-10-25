"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deduceError = exports.Throttled = exports.TemporaryNetworkFailure = exports.InvalidInput = exports.MissingInput = exports.NotFound = exports.ResourceError = exports.ProgrammingError = exports.RetriableError = exports.InputError = exports.DCFError = void 0;
var DCFError = (function (_super) {
    __extends(DCFError, _super);
    function DCFError() {
        var _this = _super.call(this) || this;
        _this.name = "DCFError";
        Object.setPrototypeOf(_this, DCFError.prototype);
        return _this;
    }
    return DCFError;
}(Error));
exports.DCFError = DCFError;
var InputError = (function (_super) {
    __extends(InputError, _super);
    function InputError() {
        var _this = _super.call(this) || this;
        _this.name = "InputError";
        Object.setPrototypeOf(_this, InputError.prototype);
        return _this;
    }
    return InputError;
}(DCFError));
exports.InputError = InputError;
var RetriableError = (function (_super) {
    __extends(RetriableError, _super);
    function RetriableError() {
        var _this = _super.call(this) || this;
        _this.name = "RetriableError";
        Object.setPrototypeOf(_this, RetriableError.prototype);
        return _this;
    }
    return RetriableError;
}(DCFError));
exports.RetriableError = RetriableError;
var ProgrammingError = (function (_super) {
    __extends(ProgrammingError, _super);
    function ProgrammingError(message) {
        var _this = _super.call(this) || this;
        _this.message = message;
        _this.name = "ProgrammingError";
        Object.setPrototypeOf(_this, ProgrammingError.prototype);
        return _this;
    }
    return ProgrammingError;
}(DCFError));
exports.ProgrammingError = ProgrammingError;
var ResourceError = (function (_super) {
    __extends(ResourceError, _super);
    function ResourceError() {
        var _this = _super.call(this) || this;
        _this.name = "ResourceError";
        Object.setPrototypeOf(_this, ResourceError.prototype);
        return _this;
    }
    return ResourceError;
}(DCFError));
exports.ResourceError = ResourceError;
var NotFound = (function (_super) {
    __extends(NotFound, _super);
    function NotFound() {
        var _this = _super.call(this) || this;
        _this.name = "NotFound";
        Object.setPrototypeOf(_this, NotFound.prototype);
        return _this;
    }
    return NotFound;
}(ResourceError));
exports.NotFound = NotFound;
var MissingInput = (function (_super) {
    __extends(MissingInput, _super);
    function MissingInput(fields) {
        var _this = _super.call(this) || this;
        _this.fields = fields;
        _this.name = "MissingInput";
        Object.setPrototypeOf(_this, MissingInput.prototype);
        return _this;
    }
    return MissingInput;
}(InputError));
exports.MissingInput = MissingInput;
var InvalidInput = (function (_super) {
    __extends(InvalidInput, _super);
    function InvalidInput(fields, general) {
        var _this = _super.call(this) || this;
        _this.fields = fields;
        _this.general = general;
        _this.name = "InvalidInput";
        Object.setPrototypeOf(_this, InvalidInput.prototype);
        return _this;
    }
    return InvalidInput;
}(InputError));
exports.InvalidInput = InvalidInput;
var TemporaryNetworkFailure = (function (_super) {
    __extends(TemporaryNetworkFailure, _super);
    function TemporaryNetworkFailure() {
        var _this = _super.call(this) || this;
        _this.name = "TemporaryNetworkFailure";
        Object.setPrototypeOf(_this, TemporaryNetworkFailure.prototype);
        return _this;
    }
    return TemporaryNetworkFailure;
}(RetriableError));
exports.TemporaryNetworkFailure = TemporaryNetworkFailure;
var Throttled = (function (_super) {
    __extends(Throttled, _super);
    function Throttled() {
        var _this = _super.call(this) || this;
        _this.name = "Throttled";
        Object.setPrototypeOf(_this, Throttled.prototype);
        return _this;
    }
    return Throttled;
}(RetriableError));
exports.Throttled = Throttled;
function deduceError(httpStatusCode, backendResponse) {
    var e_1, _a, e_2, _b;
    var _c;
    if ("message" in backendResponse && "code" in backendResponse) {
        var code = backendResponse["code"];
        var message = backendResponse["message"];
        switch (code) {
            case "not_found":
                return new NotFound();
            case "throttled":
                return new Throttled();
            default:
                return new ProgrammingError(message);
        }
    }
    else if (httpStatusCode == 400) {
        var invalidFields = new Map();
        var missingFields = new Set();
        try {
            for (var _d = __values(Object.entries(backendResponse)), _e = _d.next(); !_e.done; _e = _d.next()) {
                var _f = __read(_e.value, 2), field = _f[0], validationErrors = _f[1];
                try {
                    for (var _g = (e_2 = void 0, __values(validationErrors)), _h = _g.next(); !_h.done; _h = _g.next()) {
                        var _j = _h.value, code = _j.code, message = _j.message;
                        switch (code) {
                            case "required": {
                                missingFields.add(field);
                                break;
                            }
                            case "invalid":
                            case "does_not_exist":
                            default: {
                                var messages = (_c = invalidFields.get(field)) !== null && _c !== void 0 ? _c : [];
                                messages.push(message);
                                invalidFields.set(field, messages);
                                break;
                            }
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_h && !_h.done && (_b = _g.return)) _b.call(_g);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (missingFields.size) {
            return new MissingInput(missingFields);
        }
        if (invalidFields.size) {
            return new InvalidInput(invalidFields, []);
        }
    }
    return new ProgrammingError(backendResponse);
}
exports.deduceError = deduceError;
//# sourceMappingURL=errors.js.map