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
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const init_1 = require("./init");
const config_1 = require("./config");
const main_1 = require("./routes/main");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield init_1.init();
        const config = config_1.getConfig();
        const app = express();
        app.use(cors());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(main_1.mainRouter);
        const server = http.createServer(app);
        server.listen(config.port, config.host, function () {
            console.log(`server started at ${config.host}:${config.port}`);
        });
    });
}
main();
//# sourceMappingURL=D:/Documents/Projects/javascript/madmin/server/dist/index.js.map