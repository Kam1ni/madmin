import { Router } from "express";
import { App } from "../models/app";
import { HttpError } from "../classes/HttpError";

export const appRouter = Router();

appRouter.get("/", async (req,res,next)=>{
	res.json(await App.find());
});

appRouter.post("/", async (req,res,next)=>{
	let app = new App();
	app.subdomain = req.body.subdomain;
	app.type = req.body.type;
	if (app.type == "static"){
		app.config = {
			path: req.body.path,
			listFiles: req.body.listFiles
		}
	}else if (app.type == "proxy"){
		app.config = {
			url: req.body.url
		}
	}else{
		return next(new HttpError('"type" is a required field and can only be equal to "static" or "proxy"', 500));
	}

	await app.save();
	res.json(app);
});

appRouter.put("/:id", async (req,res,next)=>{
	let app = await App.findById(req.params.id);
	if (!app){
		return next(new HttpError("There is no app with id " + req.params.id, 500));
	}

	app.subdomain = req.body.subdomain;
	app.type = req.body.type;
	if (app.type == "static"){
		app.config = {
			path: req.body.path,
			listFiles: req.body.listFiles
		}
	}else if (app.type == "proxy"){
		app.config = {
			url: req.body.url
		}
	}else{
		return next(new HttpError('"type" is a required field and can only be equal to "static" or "proxy"', 500));
	}

	await app.save();
	res.json(app);
});

appRouter.delete("/:id", async (req,res,next)=>{
	let app = await App.findById(req.params.id);
	if (!app){
		return next(new HttpError("There is no app with id " + req.params.id, 500));
	}

	await app.remove();
	res.json({message:"Success"});
});