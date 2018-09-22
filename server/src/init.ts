import { IConfig, getConfig } from "./config";
import * as fs from "fs";
import * as path from "path";
import { UV_UDP_REUSEADDR } from "constants";
import { User } from "./models/user";
import * as readline from "readline";
import { AppSetting, initialiseSettings } from "./models/app-setting";
import * as Nedb from "nedb";

const defaultConfig:IConfig = {
	host: "0.0.0.0",
	port: 3000,
	baseUrl:"localhost.kami-dev.eu",
	saltRounds: 10,
	tokenSecret: "secret",
	clientDomain: "madmin",
	dataPath:"./data/"
}

async function createFirstUser(){
	let promise = new Promise(async (resolve)=>{
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout
		});
		console.log("There are no users in the database");
		console.log("Create a new admin user now")

		rl.question("username: ", async (username:string)=>{
			let user = new User();
			user.username = username;
			let passwordsMatch = false;
			let createPassword = new Promise((resolve, reject)=>{
				rl.question("password: ", (password:string)=>{
					rl.question("repeat password: ", (repeatPassword:string)=>{
						resolve({password, repeatPassword});
					});
				});
			});
			while(!passwordsMatch){
				let result:any = await createPassword;
				if (result.password != result.repeatPassword){
					console.log("Passwords dont match");
					console.log("Retry");
				}
				else{
					passwordsMatch = true;
					await user.setPassword(result.password);
				}
			}
			user.isAdmin = true;
			await user.save();
			console.log("User created");
			rl.close();
			resolve();
		});
	});
	await promise;
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
	try{
		if (!fs.existsSync(config.dataPath)){
			fs.mkdirSync(config.dataPath);
		}
		
	}catch(err){
		console.error("Failed connecting to the database.");
		console.log("Closing Server.");
		process.exit(0);
	}

	await initialiseSettings();

	let users = await User.find();
	if (users.length == 0){
		await createFirstUser();
	}
}