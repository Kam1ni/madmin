import {Router} from "express";
import * as express from "express";
import { getConfig } from "../config";
import { authRouter } from "./auth";
import { authenticate } from "../functions/auth";
import { appRouter } from "./app";

export const mainRouter = Router();

mainRouter.all("/", (req,res,next)=>{
	let config = getConfig();
	if (req.hostname == `${config.clientDomain}.${config.baseUrl}`){
		return next();
	}

	res.json({error:"Subdomains not implemented yet."})
});

mainRouter.use("/*", express.static("../public"));

mainRouter.use("/auth", authRouter);
mainRouter.use("/app", appRouter);

mainRouter.use("/*", async (req,res,next)=>{
	try{
		res.locals.user = await authenticate(req.headers.authorization);
	}catch(err){
		next(err);
	}
});