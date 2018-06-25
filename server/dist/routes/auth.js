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
const express_1 = require("express");
const user_1 = require("../models/user");
const jwt = require("jsonwebtoken");
const HttpError_1 = require("../classes/HttpError");
const config_1 = require("../config");
const auth_1 = require("../functions/auth");
exports.authRouter = express_1.Router();
exports.authRouter.post("/login", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let foundUser = yield user_1.User.findOne({ username: req.body.username });
    if (!foundUser) {
        return next(new HttpError_1.HttpError("Invalid login", 400));
    }
    if (foundUser.hasPassword()) {
        if (!(yield foundUser.comparePassword(req.body.password))) {
            return next(new HttpError_1.HttpError("Invalid login", 400));
        }
    }
    else {
        res.status(600);
    }
    let token = jwt.sign({ userId: foundUser._id, date: new Date().toJSON() }, config_1.getConfig().tokenSecret);
    foundUser.addToken(token);
    yield foundUser.save();
    let user = foundUser.getPrivateJson();
    res.json(user);
}));
exports.authRouter.post("/set-new-password", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        let user = yield auth_1.authenticate(req.headers.authorization);
        if (user.hasPassword()) {
            return next(new HttpError_1.HttpError("You already have a password", 500));
        }
        user.setPassword(req.body.password);
        yield user.save();
        return res.json({ message: "New password set" });
    }
    catch (err) {
        next(err);
    }
}));
exports.authRouter.use("/*", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        res.locals.user = yield auth_1.authenticate(req.headers.authorization);
        if (!res.locals.user.hasPassword()) {
            return next(new HttpError_1.HttpError("User has no password. Please use route \"/auth/set-new-password\"", 600));
        }
        next();
    }
    catch (err) {
        next(err);
    }
}));
exports.authRouter.post("/logout", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let user = res.locals.user;
    let tokenIndex = user.tokens.findIndex((t) => { return t.token == req.headers.authorization; });
    user.tokens.splice(tokenIndex, 1);
    yield user.save();
    res.json({ message: "Success" });
}));
exports.authRouter.post("/change-password", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let user = res.locals.user;
    if (!(yield user.comparePassword(req.body.oldPassword))) {
        return next(new HttpError_1.HttpError("Old password does not match", 500));
    }
    if (!req.body.newPassword) {
        return next(new HttpError_1.HttpError("New password may not be empty", 500));
    }
    yield user.setPassword(req.body.newPassword);
    yield user.save();
    res.json({ message: "Success" });
}));
//# sourceMappingURL=D:/Documents/Projects/javascript/madmin/server/dist/routes/auth.js.map