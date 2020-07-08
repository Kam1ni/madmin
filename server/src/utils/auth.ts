import * as jwt from "jsonwebtoken";
import {User, UserQuery} from "../models/user";
import { getConfig } from "./config";
import { HttpError } from "./HttpError";
import { Request, Response, NextFunction } from "express";

export async function authenticate(token:string):Promise<User>{
	try{
		var data:any = jwt.verify(token, getConfig().tokenSecret);
	}catch(err){
		throw new HttpError("Invalid token", 400);
	}
	let user = await UserQuery.findOne({_id:data.userId});
	if (!user) throw new HttpError("Invalid token", 400);
	return user;
}

export async function authenticateMiddleware(req:Request, res:Response, next:NextFunction) {
	try{
		if (!req.headers.authorization){
			throw new HttpError("Authorization header is empty", 401);
		}
		res.locals.user = await authenticate(req.headers.authorization);
		next();
	}catch(err){
		next(err);
	}
}

export function getAuthenticatedUser(res:Response):User {
	let user = res.locals.user;
	if (!user) throw new HttpError("User is not authenticated!!!", 500);
	return user;
}