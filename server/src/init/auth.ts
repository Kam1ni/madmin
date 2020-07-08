import { User, UserQuery } from "../models/user";
import * as readline from "readline";
import { userInfo } from "os";

async function createFirstUser(){
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});
	console.log("There are no users in the database");
	console.log("Create a new admin user now.");
	console.log("username: root, password: root");

	let user = new User();
	user.username = "root";
	await user.setPassword("root");
	user.isAdmin = true;
	await user.save();
}

export async function authInit(){
	let users = await UserQuery.find();
	if (users.length == 0){
		await createFirstUser();
	}
}