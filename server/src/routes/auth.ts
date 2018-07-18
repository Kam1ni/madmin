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

	if (!await foundUser.comparePassword(req.body.password)){
		return next(new HttpError("Invalid login", 400));
	}

	let token = jwt.sign({userId:foundUser._id, date:new Date().toJSON()}, getConfig().tokenSecret);
	let name = req.body.deviceName == null ? null : req.body.deviceName + "/" + req.ip;
	foundUser.addToken(token, name);
	await foundUser.save();
	let user:any = foundUser.getPrivateJson();
	user.token = token;
	res.json(user);
});

authRouter.post("/logout", async (req,res,next)=>{
	let user = await authenticate(req.headers.authorization);
	let tokenIndex = user.tokens.findIndex((t)=>{return t.token == req.headers.authorization});
	user.tokens.splice(tokenIndex, 1);
	await user.save();
	res.json({message:"Success"});
});

authRouter.use("/*", async (req,res,next)=>{
	try{
		res.locals.user = await authenticate(req.headers.authorization);
		next();
	}catch(err){
		next(err);
	}
});

authRouter.get("/", async (req,res,next)=>{
	res.json((<IUser>res.locals.user).getPrivateJson());
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

authRouter.delete("/remove-all-tokens", async (req, res, next)=>{
	let user:IUser = res.locals.user;
	user.removeAllTokens(req.headers.authorization);
	await user.save();
	console.log(user.tokens);
	res.json({message:"Success", tokens:user.tokens});
});