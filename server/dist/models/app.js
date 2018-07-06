"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AppSchema = new mongoose_1.Schema({
    subdomain: { type: String, required: true, unique: true },
    type: { type: String, enum: ["static", "proxy"], required: true },
    config: { type: mongoose_1.Schema.Types.Mixed, required: true }
});
AppSchema.path("subdomain").validate(function (value) {
    return !/\s/.test(value);
}, "Subdomain may not have spaces");
AppSchema.pre("validate", function (next) {
    let obj = this;
    obj.subdomain = obj.subdomain.toLowerCase();
    next();
});
exports.App = mongoose_1.model("App", AppSchema);
//# sourceMappingURL=d:/Documents/Projects/js/madmin/server/dist/models/app.js.map