import { Router } from "express";
import { AppSetting, getSettings } from "../models/app-setting";
import { HttpError } from "../classes/HttpError";
import { IUser } from "../models/user";

export const configRouter = Router();

configRouter.get("/", async (req,res,next)=>{
	res.json(await getSettings());
});

configRouter.put("/:name", async (req, res, next)=>{
	if (!(<IUser>res.locals.user).isAdmin){
		return next(new HttpError("You are not allowed to edit application settings", 403));
	}
	let config = await AppSetting.findOne({name:req.params.name});
	if (!config){
		return next(new HttpError("Setting \"" + req.params.name + "\" does not exist" ));
	}
	if (config.readonly){
		return next(new HttpError("Setting \"" + req.params.name + "\" is readonly", 400));
	}

	config.value = req.body.value;
	await config.save();
	res.json(config);
});