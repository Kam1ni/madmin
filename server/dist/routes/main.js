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
const handler_2 = require("../models/handler");
const config_2 = require("./config");
const app_setting_1 = require("../models/app-setting");
exports.mainRouter = express_1.Router();
exports.mainRouter.all("/", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let config = config_1.getConfig();
    if (req.hostname == `${config.clientDomain}.${config.baseUrl}`) {
        return next();
    }
    else if (req.hostname == config.baseUrl) {
        let redirectUrl = yield app_setting_1.AppSetting.findOne({ name: app_setting_1.SETTINGS.DefaultRedirect });
        return res.redirect("http://" + redirectUrl.value + "." + req.hostname);
    }
    else {
        let domains = req.hostname.split("." + config.baseUrl);
        domains.splice(domains.length - 1, 1);
        let subdomain = domains.join("." + req.baseUrl);
        let app = yield app_2.App.findOne({ subdomain, $or: [{ enabled: true }, { enabled: undefined }] });
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
exports.mainRouter.use("/*", express.static("../../client"));
exports.mainRouter.use("/auth", auth_1.authRouter);
exports.mainRouter.use("/exec-handler/*", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let path = req.originalUrl.split("/exec-handler").join("");
        let handler = yield handler_2.Handler.findOne({ path: path });
        if (!handler) {
            return next(new HttpError_1.HttpError(`No handler found at path "${path}"`, 404));
        }
        yield handler.execute(req, res);
    });
});
exports.mainRouter.use("/*", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        res.locals.user = yield auth_2.authenticate(req.headers.authorization);
        if (!res.locals.user.hasPassword()) {
            return next(new HttpError_1.HttpError("User has no password. Please use route \"/auth/set-new-password\"", 400, "NO-PASSWORD"));
        }
        next();
    }
    catch (err) {
        next(err);
    }
}));
exports.mainRouter.use("/app", app_1.appRouter);
exports.mainRouter.use("/handler", handler_1.handlerRouter);
exports.mainRouter.use("/config", config_2.configRouter);
exports.mainRouter.use("/*", (err, req, res, next) => {
    let error = err;
    let response = res;
    response.status(error.code || 500).json({ message: error.message, data: error.data });
});
//# sourceMappingURL=d:/Documents/Projects/javascript/madmin/server/dist/routes/main.js.map