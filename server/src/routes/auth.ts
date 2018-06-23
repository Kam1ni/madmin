import {Router} from "express";
import {User, IUser} from "../models/user";
import * as jwt from "jsonwebtoken";
import { HttpError } from "../classes/HttpError";
import { getConfig } from "../config";
import { authenticate } from "../functions/auth";

export const authRouter = Router();

authRouter.post("/login", async (req,res,next)=>{
	let foundUser = await User.findOne({username:req.body.username});
	if (!foundUser){
		return next(new HttpError("Invalid login", 400));
	}

	if (!foundUser.hasPassword()){
		await foundUser.setPassword(req.body.password);
	}
	else if (!await foundUser.comparePassword(req.body.password)){
		return next(new HttpError("Invalid login", 400));
	}

	let token = jwt.sign({userId:foundUser._id, date:new Date().toJSON()}, getConfig().tokenSecret);
	foundUser.addToken(token);
	await foundUser.save();
	let user:any = foundUser.getPrivateJson();
	res.json(user);
});

authRouter.use("/*", async (req,res,next)=>{
	try{
		res.locals.user = await authenticate(req.headers.authorization);
	}catch(err){
		next(err);
	}
});

authRouter.post("/logout", async (req,res,next)=>{
	let user:IUser = res.locals.user;
	let tokenIndex = user.tokens.findIndex((t)=>{return t.token == req.headers.authorization});
	user.tokens.splice(tokenIndex, 1);
	await user.save();
	res.json({message:"Success."});
});