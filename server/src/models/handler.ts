import { Document, Schema, model } from "mongoose";
import {Request, Response} from "express";

let AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;

export interface IHandler extends Document{
	path:string;
	code:string;

	execute(request:Request, response:Response);
	getFunction():(Request,Response)=>Promise<void>;
}

const HandlerSchema = new Schema({
	path:{type:String, required:true, unique:true},
	code:{type:String, required:true}
});

HandlerSchema.methods.getFunction = function(){
	return new AsyncFunction("req", "res", this.code);
}

HandlerSchema.methods.execute = async function(req:Request, res:Response){
	try{
		let fn = this.getFunction();
		await fn(req,res);
		if (!res.headersSent){
			res.send("Request Handled");
		}
	}catch(err){
		res.send("A crash occured");
		console.error(`Handler "${this.path}" crashed`);
	}
}

HandlerSchema.pre("validate", function(next){
	let obj = <IHandler>this;
	console.log(obj);
	obj.path = (<string>obj.path).toLowerCase();
	if (obj.path[0] != "/"){
		obj.path = "/" + obj.path;
	}
	next();
});

export const Handler = model<IHandler>("Handler", HandlerSchema);