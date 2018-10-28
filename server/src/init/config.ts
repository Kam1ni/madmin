import * as fs from "fs";
import * as path from "path";
import { IConfig } from "../config";

const defaultConfig:IConfig = {
	host: "0.0.0.0",
	port: 3000,
	baseUrl:"yourdomain",
	saltRounds: 10,
	tokenSecret: "secret",
	clientDomain: "madmin",
	dataPath:"./data/"
}

export function configInit(){
	if (!fs.existsSync(path.resolve(__dirname, "../../config/config.json"))){
		console.error("No config available.");
		fs.mkdirSync(path.resolve(__dirname, "../../config/"))
		fs.writeFileSync(path.resolve(__dirname, "../../config/config.json"), JSON.stringify(defaultConfig, null, 2));
		console.error("New config created. Please finish the configuration at ../config/config.json before continuing.");
		process.exit(0);
	}
}