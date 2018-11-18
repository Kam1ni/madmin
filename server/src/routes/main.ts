import {Router} from "express";
import * as express from "express";
import { getConfig, getClientConfig } from "../config";
import { authRouter } from "./auth";
import { authenticate } from "../functions/auth";
import { appRouter } from "./app";
import { App, AppQuery } from "../models/app";
import { HttpError } from "../classes/HttpError";
import { server } from "../functions/server";
import { proxy } from "../functions/proxy";
import { handlerRouter } from "./handler";
import { Handler, HandlerQuery } from "../models/handler";
import { configRouter } from "./config";
import { AppSetting, SETTINGS, AppSettingQuery, getSettings } from "../models/app-setting";
import { userRouter } from "./user";
import * as serveStatic from "serve-static"
import { resolve, join, dirname } from "path";

const mainFilePath = dirname(require.main.filename)
console.log(mainFilePath)
console.log(join(mainFilePath, "/public"))
const ClientInterfaceServe = serveStatic(join(mainFilePath, "/public"))

export const mainRouter = Router();

mainRouter.all("/*", async (req,res,next)=>{
	let config = getConfig();
	if (req.hostname == `${config.clientDomain}.${config.baseUrl}`){
		console.log("MAIN");
		if (req.path == "/manifest"){
			return res.json(getClientConfig())
		}
		return ClientInterfaceServe(req, res, next);
	}
	else if(req.hostname == config.baseUrl){
		return next();
	}
	else {
		let domains = req.hostname.split("."+config.baseUrl);
		domains.splice(domains.length-1,1);
		let subdomain = domains.join("."+req.baseUrl);
		let app = await AppQuery.findOne({subdomain,enabled:true});
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
});

mainRouter.use("/*", express.static("../../client"));
mainRouter.use("/auth", authRouter);

mainRouter.use("/exec-handler/*", async function(req,res,next){
	let path = req.originalUrl.split("/exec-handler").join("");
	let handlers = await HandlerQuery.find({path:path, methods:req.method, enabled:true});
	for (let handler of handlers){
		await handler.execute(req,res);
	}
	if (!res.headersSent){
		res.send("handled")
	}
});

mainRouter.use("/*", async (req,res,next)=>{
	try{
		res.locals.user = await authenticate(req.headers.authorization);
		next();
	}catch(err){
		next(err);
	}
});

mainRouter.use("/user", userRouter);
mainRouter.use("/app", appRouter);
mainRouter.use("/handler", handlerRouter);
mainRouter.use("/config", configRouter);

mainRouter.use("/*", async (req,res,next)=>{
	let result = await AppSettingQuery.findOne({name:SETTINGS.DefaultRedirect});
	res.redirect(result.value);
});

mainRouter.use("/*", (err, req, res, next)=>{
	let error = <HttpError> err;
	let response = <express.Response>res;
	response.status(error.code || 500).json({message:error.message, data: error.data});
});
