"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AppSchema = new mongoose_1.Schema({
    subdomain: { type: String, required: true, unique: true },
    type: { type: String, enum: ["static", "proxy"], required: true },
    config: { type: mongoose_1.Schema.Types.Mixed, required: true },
    enabled: { type: Boolean, default: true }
});
AppSchema.path("subdomain").validate(function (value) {
    return !/\s/.test(value);
}, "Subdomain may not have spaces");
AppSchema.path("config").validate(function (value) {
    if (this.type == "static") {
        return value.path != null;
    }
    else if (this.type == "proxy") {
        return value.url != null;
    }
}, "Invalid configuration");
AppSchema.pre("validate", function (next) {
    let obj = this;
    obj.subdomain = obj.subdomain.toLowerCase();
    next();
});
exports.App = mongoose_1.model("App", AppSchema);
//# sourceMappingURL=d:/Documents/Projects/js/madmin/server/dist/models/app.js.map