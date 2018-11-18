import { User, UserQuery } from "../models/user";
import * as readline from "readline";

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
			function createPassword(){ 
				return new Promise((resolve, reject)=>{
					rl.question("password: ", (password:string)=>{
						rl.question("repeat password: ", (repeatPassword:string)=>{
							resolve({password, repeatPassword});
						});
					})
				});
			}
			while(!passwordsMatch){
				let result:any = await createPassword();
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

export async function authInit(){
	// Initialise database
	

	let users = await UserQuery.find();
	if (users.length == 0){
		await createFirstUser();
	}
}