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
const app_1 = require("./app");
const app_2 = require("../models/app");
const HttpError_1 = require("../classes/HttpError");
const server_1 = require("../functions/server");
const proxy_1 = require("../functions/proxy");
const handler_1 = require("./handler");
exports.mainRouter = express_1.Router();
exports.mainRouter.all("/", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let config = config_1.getConfig();
    if (req.hostname == `${config.clientDomain}.${config.baseUrl}`) {
        return next();
    }
    else {
        let domains = req.hostname.split("." + config.baseUrl);
        domains.splice(domains.length - 1, 1);
        let subdomain = domains.join("." + req.baseUrl);
        let app = yield app_2.App.findOne({ subdomain });
        if (!app) {
            return next(new HttpError_1.HttpError("Subdomain does not exist", 500));
        }
        if (app.type == "static") {
            return server_1.server(app, req, res);
        }
        else if (app.type == "proxy") {
            return proxy_1.proxy(app, req, res);
        }
    }
    res.status(400).json({ error: "Something not yet implemented" });
}));
exports.mainRouter.use("/*", express.static("../public"));
exports.mainRouter.use("/auth", auth_1.authRouter);
exports.mainRouter.use("/app", app_1.appRouter);
exports.mainRouter.use("/handler", handler_1.handlerRouter);
exports.mainRouter.use("/*", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        res.locals.user = yield auth_2.authenticate(req.headers.authorization);
    }
    catch (err) {
        next(err);
    }
}));
//# sourceMappingURL=D:/Documents/Projects/javascript/madmin/server/dist/routes/main.js.map