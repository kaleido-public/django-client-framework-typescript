"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageResult = void 0;
var _1 = require(".");
var PageResult = (function () {
    function PageResult() {
        this.page = 0;
        this.limit = 0;
        this.total = 0;
        this.previous = "";
        this.next = "";
        this.objects = [];
    }
    Object.defineProperty(PageResult.prototype, "managers", {
        get: function () {
            return this.objects.map(function (val) { return new _1.ObjectManagerImpl(val); });
        },
        enumerable: false,
        configurable: true
    });
    return PageResult;
}());
exports.PageResult = PageResult;
//# sourceMappingURL=PageResult.js.map