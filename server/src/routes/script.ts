import { Router } from "express";
import { ScriptQuery, Script } from "../models/script";
import { HttpError } from "../utils/HttpError";
import { madminScriptRefInstance } from "../utils/madmin-script-ref";

export const scriptRouter = Router();

scriptRouter.get("/", async (req,res,next)=>{
	let scripts = await ScriptQuery.find();
	res.json(scripts);
});

scriptRouter.get("/:id", async (req, res, next)=>{
	let script = await ScriptQuery.findById(req.params.id);
	if (!script){
		return next(new HttpError("No such script", 404));
	}
	res.json(script);
});

scriptRouter.post("/", async (req,res,next)=>{
	try{
		let script = new Script();
		script.name = req.body.name;
		script.code = req.body.code;
		script.runAtStartUp = req.body.runAtStartUp;
		script.runAtInterval = req.body.runAtInterval;
		script.dayOfTheMonth = req.body.dayOfTheMonth;
		script.dayOfTheWeek = req.body.dayOfTheWeek;
		script.month = req.body.month;
		script.hour = req.body.hour;
		script.minut = req.body.minut;
		await script.save();
		res.json(script);
	}catch(err){
		next(new HttpError(err, 500));
	}
});

scriptRouter.put("/:id", async (req,res,next)=>{
	let script = await ScriptQuery.findById(req.params.id);
	if (!script){
		return next(new HttpError("Script does not exist", 404));
	}

	script.name = req.body.name;
	script.code = req.body.code;
	script.runAtStartUp = req.body.runAtStartUp;
	script.runAtInterval = req.body.runAtInterval;
	script.dayOfTheMonth = req.body.dayOfTheMonth;
	script.dayOfTheWeek = req.body.dayOfTheWeek;
	script.month = req.body.month;
	script.hour = req.body.hour;
	script.minut = req.body.minut;

	try{
		await script.save();
		res.json(script);
	}catch(err){
		next(new HttpError(err, 500));
	}
});

scriptRouter.delete("/:id", async (req,res,next)=>{
	let script = await ScriptQuery.findById(req.params.id);
	if (!script){
		return next(new HttpError("Script does not exist", 404));
	}
	await script.remove();
	res.json({message: "Success"});
});

scriptRouter.post("/:id/execute", async (req,res,next)=>{
	let script = await ScriptQuery.findById(req.params.id);
	if (!script){
		return next(new HttpError("Script does not exist", 404));
	}
	script.execute(madminScriptRefInstance, req.body.args);
	res.json({message: "Script is beign executed"});
});