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
    let token = jwt.sign({ userId: foundUser._id, date: new Date().toJSON() }, config_1.getConfig().tokenSecret);
    foundUser.addToken(token);
    yield foundUser.save();
    let user = foundUser.getPrivateJson();
    user.token = token;
    if (!foundUser.hasPassword()) {
        res.status(400);
        user.data = "NO PASSWORD";
    }
    res.json(user);
}));
exports.authRouter.post("/set-new-password", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        let user = yield auth_1.authenticate(req.headers.authorization);
        if (user.hasPassword()) {
            return next(new HttpError_1.HttpError("You already have a password", 500));
        }
        if (req.body.password == null) {
            return next(new HttpError_1.HttpError("Password cannot be \"null\"", 400));
        }
        yield user.setPassword(req.body.password);
        yield user.save();
        return res.json({ message: "New password set" });
    }
    catch (err) {
        next(err);
    }
}));
exports.authRouter.post("/logout", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let user = yield auth_1.authenticate(req.headers.authorization);
    let tokenIndex = user.tokens.findIndex((t) => { return t.token == req.headers.authorization; });
    user.tokens.splice(tokenIndex, 1);
    yield user.save();
    res.json({ message: "Success" });
}));
exports.authRouter.use("/*", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        res.locals.user = yield auth_1.authenticate(req.headers.authorization);
        if (!res.locals.user.hasPassword()) {
            return next(new HttpError_1.HttpError("User has no password. Please use route \"/auth/set-new-password\"", 400, "NO PASSWORD"));
        }
        next();
    }
    catch (err) {
        next(err);
    }
}));
exports.authRouter.get("/", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    res.json(res.locals.user.getPrivateJson());
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
//# sourceMappingURL=D:/Documents/Projects/js/madmin/server/dist/routes/auth.js.map