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
const app_1 = require("../models/app");
const HttpError_1 = require("../classes/HttpError");
exports.appRouter = express_1.Router();
exports.appRouter.get("/", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    res.json(yield app_1.App.find());
}));
exports.appRouter.post("/", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let app = new app_1.App();
    app.subdomain = req.body.subdomain;
    app.type = req.body.type;
    app.enabled = true;
    if (app.type == "static") {
        app.config = {
            path: req.body.path,
            listFiles: req.body.listFiles
        };
    }
    else if (app.type == "proxy") {
        app.config = {
            url: req.body.url
        };
    }
    else {
        return next(new HttpError_1.HttpError('"type" is a required field and can only be equal to "static" or "proxy"', 500));
    }
    yield app.save();
    res.json(app);
}));
exports.appRouter.put("/:id/enable", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let app = yield app_1.App.findById(req.params.id);
    if (!app) {
        return next(new HttpError_1.HttpError("There is no app with id " + req.params.id, 500));
    }
    if (app.enabled) {
        return next(new HttpError_1.HttpError("App is already enabled", 400));
    }
    app.enabled = true;
    yield app.save();
    return res.json(app);
}));
exports.appRouter.put("/:id/disable", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let app = yield app_1.App.findById(req.params.id);
    if (!app) {
        return next(new HttpError_1.HttpError("There is no app with id " + req.params.id, 500));
    }
    if (!app.enabled) {
        return next(new HttpError_1.HttpError("App is already disabled", 400));
    }
    app.enabled = false;
    yield app.save();
    return res.json(app);
}));
exports.appRouter.put("/:id", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let app = yield app_1.App.findById(req.params.id);
    if (!app) {
        return next(new HttpError_1.HttpError("There is no app with id " + req.params.id, 500));
    }
    app.subdomain = req.body.subdomain;
    app.type = req.body.type;
    if (app.type == "static") {
        app.config = {
            path: req.body.path,
            listFiles: req.body.listFiles
        };
    }
    else if (app.type == "proxy") {
        app.config = {
            url: req.body.url
        };
    }
    else {
        return next(new HttpError_1.HttpError('"type" is a required field and can only be equal to "static" or "proxy"', 500));
    }
    yield app.save();
    res.json(app);
}));
exports.appRouter.delete("/:id", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let app = yield app_1.App.findById(req.params.id);
    if (!app) {
        return next(new HttpError_1.HttpError("There is no app with id " + req.params.id, 500));
    }
    yield app.remove();
    res.json({ message: "Success" });
}));
//# sourceMappingURL=D:/Documents/Projects/js/madmin/server/dist/routes/app.js.map