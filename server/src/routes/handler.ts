import { Router } from "express";
import { Handler, HandlerQuery } from "../models/handler";
import { HttpError } from "../classes/HttpError";


export const handlerRouter = Router();

handlerRouter.get("/", async (req,res,next)=>{
	let handlers = await HandlerQuery.default.find();
	res.json(handlers);
});

handlerRouter.get("/:id", async(req,res,next)=>{
	let handler = await HandlerQuery.default.findById(req.params.id);
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
	let handler =  await HandlerQuery.default.findById(req.params.id);
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
		console.log(err);
		return next(new HttpError("Invalid handler " + err.message));
	}
});

handlerRouter.delete("/:id", async (req,res,next)=>{
	let handler =  await HandlerQuery.default.findById(req.params.id);
	if (!handler){
		return next(new HttpError("Handler does not exist", 404));
	}

	await handler.remove();
	res.json({message:"Success"});
});