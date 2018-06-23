"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const app = express();
app.use(cors());
app.use(bodyParser.json());
const server = http.createServer(app);
server.listen(3000, function () {
    console.log("server started");
});
//# sourceMappingURL=D:/Documents/Projects/javascript/madmin/server/dist/index.js.map