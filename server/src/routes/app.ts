import { Router } from "express";
import { App, AppQuery } from "../models/app";
import { HttpError } from "../utils/HttpError";

export const appRouter = Router();

appRouter.get("/", async (req,res,next)=>{
	res.json(await AppQuery.find());
});

appRouter.get("/:id", async(req,res,next)=>{
	let app = await AppQuery.findById(req.params.id);
	if (!app){
		return next(new HttpError("App does not exist!", 404));
	}
	res.json(app);
});

appRouter.post("/", async (req,res,next)=>{
	let app = new App();
	app.subdomain = req.body.subdomain;
	app.type = req.body.type;
	app.domainName = req.body.domainName;
	app.enabled = true;
	if (app.type == "static"){
		app.config = {
			path: req.body.config.path,
			listFiles: req.body.config.listFiles,
			error404File: req.body.config.error404File
		};
	}else if (app.type == "proxy"){
		app.config = {
			url: req.body.config.url
		};
	}else{
		return next(new HttpError('"type" is a required field and can only be equal to "static" or "proxy"', 500));
	}

	try{
		await app.save();
		res.json(app);
	}catch(err){
		return next(new HttpError("Database error " + err.message, 500));
	}
});

appRouter.put("/:id/enable", async (req,res,next)=>{
	let app = await AppQuery.findById(req.params.id);
	if (!app){
		return next(new HttpError("There is no app with id " + req.params.id, 500));
	}

	app.enabled = true;
	await app.save();
	return res.json(app);
});

appRouter.put("/:id/disable", async (req,res,next)=>{
	let app = await AppQuery.findById(req.params.id);
	if (!app){
		return next(new HttpError("There is no app with id " + req.params.id, 500));
	}

	app.enabled = false;
	await app.save();
	return res.json(app);
});

appRouter.put("/:id", async (req,res,next)=>{
	let app = await AppQuery.findById(req.params.id);
	if (!app){
		return next(new HttpError("There is no app with id " + req.params.id, 500));
	}

	app.subdomain = req.body.subdomain;
	app.type = req.body.type;
	app.domainName = req.body.domainName;
	if (app.type == "static"){
		app.config = {
			path: req.body.config.path,
			listFiles: req.body.config.listFiles,
			error404File: req.body.config.error404File
		};
	}else if (app.type == "proxy"){
		app.config = {
			url: req.body.config.url
		};
	}else{
		return next(new HttpError('"type" is a required field and can only be equal to "static" or "proxy"', 500));
	}

	await app.save();
	res.json(app);
});

appRouter.delete("/:id", async (req,res,next)=>{
	let app = await AppQuery.findById(req.params.id);
	if (!app){
		return next(new HttpError("There is no app with id " + req.params.id, 500));
	}

	await app.remove();
	res.json({message: "Success"});
});