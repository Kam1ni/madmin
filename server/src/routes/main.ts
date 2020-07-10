import {Router} from "express";
import {Request, Response, NextFunction} from "express";
import * as express from "express";
import { getConfig, getClientConfig } from "../utils/config";
import { authRouter } from "./auth";
import { authenticate } from "../utils/auth";
import { appRouter } from "./app";
import { App, AppQuery } from "../models/app";
import { HttpError } from "../utils/HttpError";
import { server } from "../utils/server";
import { proxy } from "../utils/proxy";
import { handlerRouter } from "./handler";
import { Handler, HandlerQuery } from "../models/handler";
import { configRouter } from "./config";
import { AppSetting, SETTINGS, AppSettingQuery, getSettings } from "../models/app-setting";
import { userRouter } from "./user";
import * as serveStatic from "serve-static";
import { resolve, join, dirname } from "path";
import { scriptRouter } from "./script";
import { madminScriptRefInstance } from "../utils/madmin-script-ref";
import { fileSystemRouter } from "./file-system";

if (!require.main) {
	throw new Error("This shouldn't happen. require.main is undefined");
}

const mainFilePath = dirname(require.main.filename);
const clientPath = join(mainFilePath, "/public");
const ClientInterfaceServe = serveStatic(clientPath);

export const mainRouter = Router();

const mainDomainRegex = new RegExp(getConfig().baseUrl + "$");

mainRouter.all("/*", async (req,res,next)=>{
	let config = getConfig();
	if (req.hostname == `${config.clientDomain}.${config.baseUrl}`){
		if (req.path == "/manifest"){
			return res.json(getClientConfig());
		}
		return ClientInterfaceServe(req, res, ()=>{
			res.sendFile(join(clientPath, "/index.html"));
		});
	} else if(req.hostname == config.baseUrl){
		if (/^\/?$/.exec(req.path)){
			let defaultRedirect = await AppSettingQuery.findOne({name: SETTINGS.DefaultRedirect});
			if (defaultRedirect){
				return res.redirect(`${req.protocol}://${defaultRedirect.value}.${config.baseUrl}:${config.port}`);
			}
		}
		return next();
	}

	let domains = req.hostname.split("."+config.baseUrl);
	domains.splice(domains.length-1,1);
	let subdomain = domains.join("."+req.baseUrl);
	if (req.hostname.match(mainDomainRegex)){
		var app = await AppQuery.findBySubdomain(subdomain);
	}else{
		var app = await AppQuery.findOne({domainName: req.hostname});
	}
	if (!app){
		return next(new HttpError("Domain does not exist", 500));
	}
	if (app.type == "static"){
		return server(app, req, res);
	} else if (app.type == "proxy"){
		return proxy(app, req, res);
	}

});

mainRouter.use("/*", express.static("../../client"));
mainRouter.use("/auth", authRouter);

mainRouter.use("/exec-handler/*", async function(req,res,next){
	let path = req.originalUrl.split("/exec-handler").join("");
	let handlers = await HandlerQuery.find({path, methods: req.method, enabled: true});
	for (let handler of handlers){
		await handler.execute(madminScriptRefInstance, req,res);
	}
	if (!res.headersSent){
		res.send("handled");
	}
});

mainRouter.use("/*", async (req:Request,res:Response ,next:NextFunction)=>{
	if (!req.headers.authorization) {
		next(new HttpError("Missing authorization token", 400));
		return;
	}
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
mainRouter.use("/script", scriptRouter);
mainRouter.use("/config", configRouter);
mainRouter.use("/fs", fileSystemRouter);

mainRouter.use("/*", async (req,res,next)=>{
	let result = await AppSettingQuery.findOne({name: SETTINGS.DefaultRedirect});
	if (!result) return next(new HttpError("No default redirect.", 500));
	res.redirect(result.value);
});

mainRouter.use("/*", (err:HttpError, req:Request, res:Response, next:NextFunction)=>{
	res.status(err.code || 500).json({message: err.message, data: err.data});
});
