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
const config_1 = require("./config");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const user_1 = require("./models/user");
const readline = require("readline");
const defaultConfig = {
    host: "0.0.0.0",
    port: 3000,
    baseUrl: "localhost.kami-dev.eu",
    saltRounds: 10,
    tokenSecret: "secret",
    clientDomain: "madmin",
    database: {
        host: "mongodb://localhost:27017",
        database: "madmin",
        username: null,
        password: null
    }
};
function createFirstUser() {
    return __awaiter(this, void 0, void 0, function* () {
        let promise = new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            console.log("There are no users in the database");
            console.log("Create a new admin user now");
            rl.question("username: ", (username) => __awaiter(this, void 0, void 0, function* () {
                let user = new user_1.User();
                user.username = username;
                let passwordsMatch = false;
                let createPassword = new Promise((resolve, reject) => {
                    rl.question("password: ", (password) => {
                        rl.question("repeat password: ", (repeatPassword) => {
                            resolve({ password, repeatPassword });
                        });
                    });
                });
                while (!passwordsMatch) {
                    let result = yield createPassword;
                    if (result.password != result.repeatPassword) {
                        console.log("Passwords dont match");
                        console.log("Retry");
                    }
                    else {
                        passwordsMatch = true;
                        yield user.setPassword(result.password);
                    }
                }
                user.isAdmin = true;
                yield user.save();
                console.log("User created");
                rl.close();
                resolve();
            }));
        }));
        yield promise;
    });
}
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            var config = config_1.getConfig();
        }
        catch (err) {
            console.error("No config available.");
            fs.writeFileSync(path.resolve(__dirname, "../config/config.json"), JSON.stringify(defaultConfig, null, 2));
            console.error("New config created. Please finish the configuration at ../config/config.json before continuing.");
            process.exit(0);
        }
        mongoose.Promise = global.Promise;
        try {
            console.log("Connecting to the database");
            let dbConf = config.database;
            let dbUrl = dbConf.host + "/" + dbConf.database;
            if (dbConf.username) {
                let url = config.database.host.split("//");
                let dbUrl = `${url[0]}//${dbConf.username}:${dbConf.password}@${url}`;
            }
            yield mongoose.connect(dbUrl, { useMongoClient: true });
            console.log("Connected to the database");
        }
        catch (err) {
            console.error("Failed connecting to the database.");
            console.log("Closing Server.");
            process.exit(0);
        }
        let users = yield user_1.User.find();
        if (users.length == 0) {
            yield createFirstUser();
        }
    });
}
exports.init = init;
//# sourceMappingURL=d:/Documents/Projects/javascript/madmin/server/dist/init.js.map