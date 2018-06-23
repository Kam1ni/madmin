"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpError extends Error {
    constructor(message, code = 500) {
        super(message);
        this.code = code;
    }
}
exports.HttpError = HttpError;
//# sourceMappingURL=D:/Documents/Projects/javascript/madmin/server/dist/classes/HttpError.js.map