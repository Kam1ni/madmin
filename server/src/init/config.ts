import * as fs from "fs";
import * as path from "path";
import { IConfig, setConfig } from "../config";
const mainFilePath = process.cwd();

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
	let confDir = path.resolve(mainFilePath, "config");
	let confPath = path.resolve(confDir, "config.json")
	if (!fs.existsSync(confPath)){
		console.error("No config available.", {confDir});
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