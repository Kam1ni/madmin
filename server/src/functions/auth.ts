import * as jwt from "jsonwebtoken";
import {User, UserQuery} from "../models/user";
import { getConfig } from "../config";
import { HttpError } from "../classes/HttpError";

export async function authenticate(token:string):Promise<User>{
	try{
		var data:any = jwt.verify(token, getConfig().tokenSecret);
	}catch(err){
		throw new HttpError("Invalid token", 400);
	}
	let user = await UserQuery.findOne({_id:data.userId});
	if (!user) throw new HttpError("Invalid token", 400);
	let foundToken = user.tokens.find(t=>{
		return t.token == token;
	});

	if (!foundToken) throw new HttpError("Invalid token", 400);
	return user;
}