import { IConfig, getConfig } from "../utils/config";
import * as path from "path";
import * as fs from "fs";

export async function dataInit(){
	let config = getConfig();
	try{
		if (!fs.existsSync(config.dataPath)){
			fs.mkdirSync(config.dataPath);
		}
	}catch(err){
		console.error("Failed creating data directory");
		console.log("Closing Server.");
		process.exit(0);
	}
}