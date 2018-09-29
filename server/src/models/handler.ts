import { Document, Schema, model } from "mongoose";
import {Request, Response} from "express";
import * as Nedb from "nedb";
import * as path from "path";
import { getConfig } from "../config";
import { BaseModel, BaseQuery } from "./base-model";

const AsyncFunction = new Function("return Object.getPrototypeOf(async function(){}).constructor")();

const db = new Nedb({filename:path.join(getConfig().dataPath, "handler.db"), autoload:true})

export class Handler extends BaseModel<Handler>{
	protected db: Nedb = db;

	path:string;
	code:string;

	constructor(data:any = null){
		super(data);
	}

	async execute(request:Request, response:Response){
		try{
			let fn = this.getFunction();
			await fn(request, response, require);
			if (!response.headersSent){
				response.send("Request Handled");
			}
		}catch(err){
			if (!response.headersSent){
				response.send("A crash occured");
			}
			console.error(`Handler "${this.path}" crashed`);
			console.error(err.message);
		}
	}

	getFunction():(Request:Request,Response:Response,require:NodeRequire)=>Promise<void>{
		return new AsyncFunction("req", "res", "require", this.code);
	}

	validate():Promise<string>{
		this.path = (<string>this.path).toLowerCase();
		if (this.path[0] != "/"){
			this.path = "/" + this.path;
		}
		return null;
	}
}

export class HandlerQuery extends BaseQuery<Handler>{
	protected type: new (data: any) => Handler = Handler;
	protected db: Nedb = db;
	static default = new HandlerQuery();
}