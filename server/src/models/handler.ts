import { Document, Schema, model } from "mongoose";
import {Request, Response} from "express";

const AsyncFunction = new Function("return Object.getPrototypeOf(async function(){}).constructor")();

export interface IHandler extends Document{
	path:string;
	code:string;

	execute(request:Request, response:Response);
	getFunction():(Request:Request,Response:Response,require:NodeRequire)=>Promise<void>;
}

const HandlerSchema = new Schema({
	path:{type:String, required:true, unique:true},
	code:{type:String, required:true}
});

HandlerSchema.methods.getFunction = function(){
	return new AsyncFunction("req", "res", "require", this.code);
}

HandlerSchema.methods.execute = async function(req:Request, res:Response){
	try{
		let fn = this.getFunction();
		await fn(req, res, require);
		if (!res.headersSent){
			res.send("Request Handled");
		}
	}catch(err){
		if (!res.headersSent){
			res.send("A crash occured");
		}
		console.error(`Handler "${this.path}" crashed`);
		console.error(err.message);
	}
}

HandlerSchema.pre("validate", function(next){
	let obj = <IHandler>this;
	obj.path = (<string>obj.path).toLowerCase();
	if (obj.path[0] != "/"){
		obj.path = "/" + obj.path;
	}
	next();
});

export const Handler = model<IHandler>("Handler", HandlerSchema);