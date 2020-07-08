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
	let user:any = foundUser.getPrivateJson();
	user.token = token;
	res.json(user);
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
