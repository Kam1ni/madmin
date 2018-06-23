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
const bcrypt = require("bcrypt");
const config_1 = require("../config");
const UserSchema = new mongoose_1.Schema({
    username: { type: String, required: true },
    password: { type: String, requried: true },
    isAdmin: { type: Boolean, required: false },
    tokens: [
        {
            token: { type: String, required: true, unique: true },
            deviceName: { type: String, required: true, unique: true }
        }
    ]
});
UserSchema.methods.hasPassword = function () {
    return this.password != null;
};
UserSchema.methods.setPassword = function (newPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        if (newPassword == null) {
            this.password = null;
        }
        let hash = yield bcrypt.hash(newPassword, config_1.getConfig().saltRounds);
        this.password = hash;
    });
};
UserSchema.methods.comparePassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt.compare(password, this.password);
    });
};
UserSchema.methods.getPublicJson = function () {
    return {
        username: this.username,
        isAdmin: this.isAdmin,
    };
};
UserSchema.methods.getPrivateJson = function () {
    let user = this.getPublicJson();
    user.tokens = this.tokens;
    return user;
};
UserSchema.methods.addToken = function (token, name = null) {
    if (name == null) {
        name = new Date().toUTCString();
    }
    this.tokens.push({ token: token, name });
};
exports.User = mongoose_1.model("User", UserSchema);
//# sourceMappingURL=D:/Documents/Projects/javascript/madmin/server/dist/models/user.js.map