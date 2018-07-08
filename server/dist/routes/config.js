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
const app_setting_1 = require("../models/app-setting");
const HttpError_1 = require("../classes/HttpError");
exports.configRouter = express_1.Router();
exports.configRouter.get("/", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    res.json(yield app_setting_1.getSettings());
}));
exports.configRouter.put("/:name", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    if (!res.locals.user.isAdmin) {
        return next(new HttpError_1.HttpError("You are not allowed to edit application settings", 403));
    }
    let config = yield app_setting_1.AppSetting.findOne({ name: req.params.name });
    if (!config) {
        return next(new HttpError_1.HttpError("Setting \"" + req.params.name + "\" does not exist"));
    }
    if (config.readonly) {
        return next(new HttpError_1.HttpError("Setting \"" + req.params.name + "\" is readonly", 400));
    }
    config.value = req.body.value;
    yield config.save();
    res.json(config);
}));
//# sourceMappingURL=d:/Documents/Projects/js/madmin/server/dist/routes/config.js.map