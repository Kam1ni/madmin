import {Router} from "express";
import * as express from "express";
import { getConfig } from "../config";
import { authRouter } from "./auth";
import { authenticate } from "../functions/auth";
import { appRouter } from "./app";
import { App } from "../models/app";
import { HttpError } from "../classes/HttpError";
import { server } from "../functions/server";

export const mainRouter = Router();

mainRouter.all("/", async (req,res,next)=>{
	let config = getConfig();
	if (req.hostname == `${config.clientDomain}.${config.baseUrl}`){
		return next();
	}else{
		let domains = req.hostname.split("."+config.baseUrl);
		domains.splice(domains.length-1,1);
		let subdomain = domains.join("."+req.baseUrl);
		let app = await App.findOne({subdomain});
		if (!app){
			return next(new HttpError("Subdomain does not exist", 500));
		}
		if (app.type == "static"){
			return server(app, req, res);
		}
	}

	res.status(400).json({error:"Something not yet implemented"})
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