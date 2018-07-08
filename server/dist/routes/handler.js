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
const handler_1 = require("../models/handler");
const HttpError_1 = require("../classes/HttpError");
exports.handlerRouter = express_1.Router();
exports.handlerRouter.get("/", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let handlers = yield handler_1.Handler.find();
    res.json(handlers);
}));
exports.handlerRouter.get("/:id", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let handler = yield handler_1.Handler.findById(req.params.id);
    if (!handler) {
        return next(new HttpError_1.HttpError("No such handler", 404));
    }
    res.json(handler);
}));
exports.handlerRouter.post("/", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        let handler = new handler_1.Handler(req.body);
        handler.getFunction();
        yield handler.save();
        res.json(handler);
    }
    catch (err) {
        console.log(err);
        next(new HttpError_1.HttpError("Invalid handler", 500));
    }
}));
exports.handlerRouter.put("/:id", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let handler = yield handler_1.Handler.findById(req.params.id);
    if (!handler) {
        return next(new HttpError_1.HttpError("Handler does not exist", 404));
    }
    handler.path = req.body.path;
    handler.code = req.body.code;
    try {
        handler.getFunction();
        yield handler.save();
        res.json(handler);
    }
    catch (err) {
        console.log(err);
        return next(new HttpError_1.HttpError("Invalid handler " + err.message));
    }
}));
exports.handlerRouter.delete("/:id", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let handler = yield handler_1.Handler.findById(req.params.id);
    if (!handler) {
        return next(new HttpError_1.HttpError("Handler does not exist", 404));
    }
    yield handler.remove();
    res.json({ message: "Success" });
}));
//# sourceMappingURL=d:/Documents/Projects/js/madmin/server/dist/routes/handler.js.map