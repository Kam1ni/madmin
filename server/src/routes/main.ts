import {Router} from "express";
import * as express from "express";
import { getConfig } from "../config";
import { authRouter } from "./auth";
import { authenticate } from "../functions/auth";
import { appRouter } from "./app";
import { App } from "../models/app";
import { HttpError } from "../classes/HttpError";
import { server } from "../functions/server";
import { proxy } from "../functions/proxy";
import { handlerRouter } from "./handler";
import { Handler } from "../models/handler";

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
		else if (app.type == "proxy"){
			return proxy(app, req, res);
		}
	}

	res.status(400).json({error:"Something not yet implemented"})
});

mainRouter.use("/*", express.static("../../client"));
mainRouter.use("/auth", authRouter);

mainRouter.use("/handler/*", async function(req,res,next){
	let path = req.path.split("/handler").join("");
	let handler = await Handler.findOne({path:path});
	if (!handler){
		return next(new HttpError(`No handler found at path "${path}"`, 404));
	}
	await handler.execute(req,res);
});

mainRouter.use("/*", async (req,res,next)=>{
	try{
		res.locals.user = await authenticate(req.headers.authorization);
	}catch(err){
		next(err);
	}
});

mainRouter.use("/app", appRouter);
mainRouter.use("/handler", handlerRouter);