import * as jwt from "jsonwebtoken";
import {User} from "../models/user";
import { getConfig } from "../config";
import { HttpError } from "../classes/HttpError";

export async function authenticate(token:string):Promise<User>{
	let data:any = jwt.verify(token, getConfig().tokenSecret);
	let user = await User.findOne({_id:data.userId});
	if (!user) throw new HttpError("Invalid token", 400);
	let foundToken = user.tokens.find(t=>{
		return t.token == token;
	});

	if (!foundToken) throw new HttpError("Invalid token", 400);
	return user;
}