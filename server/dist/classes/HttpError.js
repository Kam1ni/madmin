"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpError extends Error {
    constructor(message, code = 500, data = undefined) {
        super(message);
        this.code = code;
        this.data = data;
        if (code == null) {
            this.code = 500;
        }
    }
}
exports.HttpError = HttpError;
//# sourceMappingURL=d:/Documents/Projects/js/madmin/server/dist/classes/HttpError.js.map