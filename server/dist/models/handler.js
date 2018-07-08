"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AsyncFunction = new Function("return Object.getPrototypeOf(async function(){}).constructor")();
const HandlerSchema = new mongoose_1.Schema({
    path: { type: String, required: true, unique: true },
    code: { type: String, required: true }
});
HandlerSchema.methods.getFunction = function () {
    return new AsyncFunction("req", "res", "require", this.code);
};
HandlerSchema.methods.execute = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let fn = this.getFunction();
            yield fn(req, res, require);
            if (!res.headersSent) {
                res.send("Request Handled");
            }
        }
        catch (err) {
            if (!res.headersSent) {
                res.send("A crash occured");
            }
            console.error(`Handler "${this.path}" crashed`);
            console.error(err.message);
        }
    });
};
HandlerSchema.pre("validate", function (next) {
    let obj = this;
    obj.path = obj.path.toLowerCase();
    if (obj.path[0] != "/") {
        obj.path = "/" + obj.path;
    }
    next();
});
exports.Handler = mongoose_1.model("Handler", HandlerSchema);
//# sourceMappingURL=d:/Documents/Projects/js/madmin/server/dist/models/handler.js.map