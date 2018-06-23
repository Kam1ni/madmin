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
const express = require("express");
const config_1 = require("../config");
const auth_1 = require("./auth");
const auth_2 = require("../functions/auth");
exports.mainRouter = express_1.Router();
exports.mainRouter.all("/", (req, res, next) => {
    let config = config_1.getConfig();
    if (req.hostname == `${config.clientDomain}.${config.baseUrl}`) {
        return next();
    }
    res.json({ error: "Subdomains not implemented yet." });
});
exports.mainRouter.use("/*", express.static("../public"));
exports.mainRouter.use("/auth", auth_1.authRouter);
exports.mainRouter.use("/*", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        res.locals.user = yield auth_2.authenticate(req.headers.authorization);
    }
    catch (err) {
        next(err);
    }
}));
//# sourceMappingURL=D:/Documents/Projects/javascript/madmin/server/dist/routes/main.js.map