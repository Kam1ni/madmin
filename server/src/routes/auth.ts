import {Router} from "express";
import {User, UserQuery} from "../models/user";
import * as jwt from "jsonwebtoken";
import { HttpError } from "../utils/HttpError";
import { getConfig } from "../utils/config";
import { authenticate, authenticateMiddleware, getAuthenticatedUser } from "../utils/auth";

export const authRouter = Router();

authRouter.post("/login", async (req,res,next)=>{
	let foundUser = await UserQuery.findOne({username:req.body.username});
	if (!foundUser){
		return next(new HttpError("Invalid login", 400));
	}

	if (!await foundUser.comparePassword(req.body.password)){
		return next(new HttpError("Invalid login", 400));
	}
	let token = jwt.sign({userId:foundUser._id, date:new Date().toJSON()}, getConfig().tokenSecret);
	let name = req.body.deviceName == null ? undefined : req.body.deviceName + "/" + req.ip;
	foundUser.addToken(token, name);
	await foundUser.save();
	let user:any = foundUser.getPrivateJson();
	user.token = token;
	res.json(user);
});

authRouter.post("/logout", async (req,res,next)=>{
	if (!req.headers.authorization) {
		return next(new HttpError("Authorization header empty", 401));
	}
	let user = await authenticate(req.headers.authorization);
	let tokenIndex = user.tokens.findIndex((t)=>{return t.token == req.headers.authorization});
	user.tokens.splice(tokenIndex, 1);
	await user.save();
	res.json({message:"Success"});
});

authRouter.use("/*", authenticateMiddleware);

authRouter.get("/", async (req,res,next)=>{
	res.json(getAuthenticatedUser(res).getPrivateJson());
});

authRouter.post("/change-password", async (req,res,next)=>{
	let user = getAuthenticatedUser(res);
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
	if (!req.headers.authorization) return next(new HttpError("Authorization header is empty", 500));
	let user = getAuthenticatedUser(res)
	user.removeAllTokens(req.headers.authorization);
	await user.save();
	res.json({message:"Success", tokens:user.tokens});
});
