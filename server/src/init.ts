import { IConfig, getConfig } from "./config";
import * as fs from "fs";
import * as path from "path";
import * as mongoose from "mongoose";

const defaultConfig:IConfig = {
	host: "0.0.0.0",
	port: 3000,
	baseUrl:"localhost.kami-dev.eu",
	saltRounds: 10,
	tokenSecret: "secret",
	clientDomain: "madmin",
	database: {
		host: "mongodb://localhost:27017",
		database: "madmin",
		username: null,
		password: null
	}
}

export async function init(){
	// Initialise config
	try {
		var config = getConfig();
	} catch(err){
		console.error("No config available.");
		fs.writeFileSync(path.resolve(__dirname, "../config/config.json"), JSON.stringify(defaultConfig, null, 2));
		console.error("New config created. Please finish the configuration at ../config/config.json before continuing.");
		process.exit(0);
	}

	// Initialise database
	(<any>mongoose).Promise = global.Promise;
	try{
		console.log("Connecting to the database");
		let dbConf = config.database;
		let dbUrl = dbConf.host + "/" + dbConf.database;
		if (dbConf.username){
			let url = config.database.host.split("//");
			let dbUrl = `${url[0]}//${dbConf.username}:${dbConf.password}@${url}`;
		}
		await mongoose.connect(dbUrl, {useMongoClient:true});
		console.log("Connected to the database");
	}catch(err){
		console.error("Failed connecting to the database.");
		console.log("Closing Server.");
		process.exit(0);
	}
}