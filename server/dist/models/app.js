"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AppSchema = new mongoose_1.Schema({
    subdomain: { type: String, required: true, unique: true },
    type: { type: String, enum: ["static", "proxy"], required: true },
    config: { type: mongoose_1.Schema.Types.Mixed, required: true }
});
exports.App = mongoose_1.model("App", AppSchema);
//# sourceMappingURL=D:/Documents/Projects/javascript/madmin/server/dist/models/app.js.map