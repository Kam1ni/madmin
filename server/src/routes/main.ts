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
import { configRouter } from "./config";
import { AppSetting, SETTINGS } from "../models/app-setting";
import { userRouter } from "./user";

export const mainRouter = Router();

mainRouter.all("/*", async (req,res,next)=>{
	let config = getConfig();
	if (req.hostname == `${config.clientDomain}.${config.baseUrl}`){
		return next();
	}
	else if(req.hostname == config.baseUrl){
		let redirectUrl = await AppSetting.findOne({name:SETTINGS.DefaultRedirect});
		return res.redirect("http://" + redirectUrl.value + "." + req.hostname + ":" + getConfig().port);
	}
	else {
		let domains = req.hostname.split("."+config.baseUrl);
		domains.splice(domains.length-1,1);
		let subdomain = domains.join("."+req.baseUrl);
		let app = await App.findOne({subdomain, $or:[{enabled:true}, {enabled:undefined}]});
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

mainRouter.use("/exec-handler/*", async function(req,res,next){
	let path = req.originalUrl.split("/exec-handler").join("");
	let handler = await Handler.findOne({path:path});
	if (!handler){
		return next(new HttpError(`No handler found at path "${path}"`, 404));
	}
	await handler.execute(req,res);
});

mainRouter.use("/user", userRouter);

mainRouter.use("/*", async (req,res,next)=>{
	try{
		res.locals.user = await authenticate(req.headers.authorization);
		next();
	}catch(err){
		next(err);
	}
});

mainRouter.use("/app", appRouter);
mainRouter.use("/handler", handlerRouter);
mainRouter.use("/config", configRouter);

mainRouter.use("/*", (err, req, res, next)=>{
	let error = <HttpError> err;
	let response = <express.Response>res;
	response.status(error.code || 500).json({message:error.message, data: error.data});
});