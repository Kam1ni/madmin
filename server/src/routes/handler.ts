import { Router } from "express";
import { Handler } from "../models/handler";
import { HttpError } from "../classes/HttpError";


export const handlerRouter = Router();

handlerRouter.get("/", async (req,res,next)=>{
	let handlers = await Handler.find();
	res.json(handlers);
});

handlerRouter.get("/:id", async(req,res,next)=>{
	let handler = await Handler.findById(req.params.id);
	if (!handler){
		return next(new HttpError("No such handler", 404));
	}
	res.json(handler);
});

handlerRouter.post("/", async (req,res,next)=>{
	try{
		let handler = new Handler(req.body);
		handler.getFunction();
		await handler.save();
		res.json(handler);
	}catch(err){
		console.log(err);
		next(new HttpError("Invalid handler", 500));
	}
});

handlerRouter.put("/:id", async (req,res,next)=>{
	let handler =  await Handler.findById(req.params.id);
	if (!handler){
		return next(new HttpError("Handler does not exist", 404));
	}

	handler.path = req.body.path;
	handler.code = req.body.code;

	try{
		handler.getFunction();
		await handler.save();
		res.json(handler);
	}catch(err){
		return next(new HttpError("Invalid handler"));
	}
});

handlerRouter.delete("/:id", async (req,res,next)=>{
	let handler =  await Handler.findById(req.params.id);
	if (!handler){
		return next(new HttpError("Handler does not exist", 404));
	}

	await handler.remove();
	res.json({message:"Success"});

});