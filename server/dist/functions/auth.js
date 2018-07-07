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
const jwt = require("jsonwebtoken");
const user_1 = require("../models/user");
const config_1 = require("../config");
const HttpError_1 = require("../classes/HttpError");
function authenticate(token) {
    return __awaiter(this, void 0, void 0, function* () {
        let data = jwt.verify(token, config_1.getConfig().tokenSecret);
        let user = yield user_1.User.findOne({ _id: data.userId });
        if (!user)
            throw new HttpError_1.HttpError("Invalid token", 400);
        let foundToken = user.tokens.find(t => {
            return t.token == token;
        });
        if (!foundToken)
            throw new HttpError_1.HttpError("Invalid token", 400);
        return user;
    });
}
exports.authenticate = authenticate;
//# sourceMappingURL=D:/Documents/Projects/js/madmin/server/dist/functions/auth.js.map