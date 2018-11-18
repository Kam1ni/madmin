import * as fs from "fs";
import * as path from "path";
import { IConfig, setConfig } from "../config";
import * as randomstring from "randomstring";
import md5 = require("md5");

const mainFilePath = process.cwd();

const defaultConfig:IConfig = {
	host: "0.0.0.0",
	port: 3000,
	baseUrl:"yourdomain",
	saltRounds: 10,
	tokenSecret: md5(randomstring.generate()),
	clientDomain: "madmin",
	dataPath:"./data/"
}

export function configInit(){
	let confDir = path.resolve(mainFilePath, "config");
	let confPath = path.resolve(confDir, "config.json")
	if (!fs.existsSync(confPath)){
		console.error("No config available.");
		if (!fs.existsSync(confDir)){
			fs.mkdirSync(path.resolve(confDir))
		}
		fs.writeFileSync(confPath, JSON.stringify(defaultConfig, null, 2));
		console.error(`New config created. Please finish the configuration at ${confPath} before continuing.`);
		process.exit(0);
	}else {
		let result = fs.readFileSync(confPath);
		let conf = <IConfig>JSON.parse(result.toString())
		setConfig(conf)
	}
}