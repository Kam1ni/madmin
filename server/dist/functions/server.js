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
const path_1 = require("path");
const fs = require("fs");
const util_1 = require("util");
const lstatAsync = util_1.promisify(fs.lstat);
const readDirAsync = util_1.promisify(fs.readdir);
function listFiles(path, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let dirContent = yield readDirAsync(path);
        let response = "<!DOCTYPE html><html><body><ul>";
        for (let item of dirContent) {
            response += `<li><a href="${path}/${item}">${item}</a></li>`;
        }
        response += "</ul></body></html>";
        res.send(response);
    });
}
function server(app, req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let config = app.config;
        let basePath = config.path;
        let fullPath = path_1.resolve(basePath, req.path);
        let pathStats = yield lstatAsync(fullPath);
        if (pathStats.isFile()) {
            return res.sendFile(fullPath);
        }
        if (!config.listFiles) {
            return res.status(404).send("Don't mind us. Nothing to see here :)");
        }
        listFiles(fullPath, res);
    });
}
exports.server = server;
//# sourceMappingURL=D:/Documents/Projects/javascript/madmin/server/dist/functions/server.js.map