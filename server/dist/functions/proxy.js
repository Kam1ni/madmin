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
const http = require("http");
function proxy(app, req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let config = app.config;
        let options = {
            host: config.url,
            path: req.path,
            method: req.method,
            headers: req.headers,
        };
        let request = http.request(options, function (response) {
            response.setEncoding("utf8");
            let receivedData = [];
            response.on("data", (chunk) => {
                receivedData.push(chunk);
            });
            res.set(response.headers);
            response.on("end", () => {
                res.send(receivedData.join(""));
            });
        });
        if (req.body) {
            request.write(JSON.stringify(req.body));
        }
        request.end();
    });
}
exports.proxy = proxy;
//# sourceMappingURL=D:/Documents/Projects/javascript/madmin/server/dist/functions/proxy.js.map