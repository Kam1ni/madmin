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

	if (foundUser.hasPassword()){
		if (!await foundUser.comparePassword(req.body.password)){
			return next(new HttpError("Invalid login", 400));
		}
	}

	let token = jwt.sign({userId:foundUser._id, date:new Date().toJSON()}, getConfig().tokenSecret);
	foundUser.addToken(token);
	await foundUser.save();
	let user:any = foundUser.getPrivateJson();
	res.json(user);
});

authRouter.post("/set-new-password", async (req,res,next)=>{
	try{
		let user = await authenticate(req.headers.authorization);
		if (user.hasPassword()){
			return next(new HttpError("You already have a password", 500));
		}
		user.setPassword(req.body.password);
		await user.save();
		return res.json({message:"New password set"});
	}catch(err){
		next(err);
	}
})

authRouter.use("/*", async (req,res,next)=>{
	try{
		res.locals.user = await authenticate(req.headers.authorization);
		if (!res.locals.user.hasPassword()){
			return next(new HttpError("User has no password. Please use route \"/auth/set-new-password\"", 600));
		}
		next();
	}catch(err){
		next(err);
	}
});

authRouter.post("/logout", async (req,res,next)=>{
	let user:IUser = res.locals.user;
	let tokenIndex = user.tokens.findIndex((t)=>{return t.token == req.headers.authorization});
	user.tokens.splice(tokenIndex, 1);
	await user.save();
	res.json({message:"Success"});
});

authRouter.post("/change-password", async (req,res,next)=>{
	let user:IUser = res.locals.user;
	if (!await user.comparePassword(req.body.oldPassword)){
		return next(new HttpError("Old password does not match", 500));
	}

	if (!req.body.newPassword){
		return next(new HttpError("New password may not be empty", 500));
	}

	await user.setPassword(req.body.newPassword);
	await user.save();
	res.json({message:"Success"});
});