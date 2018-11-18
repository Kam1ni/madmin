import {Request, Response} from "express";
import * as Nedb from "nedb";
import * as path from "path";
import { getConfig } from "../config";
import { BaseModel, BaseQuery } from "./base-model";
import { exec } from "child_process";

const AsyncFunction = new Function("return Object.getPrototypeOf(async function(){}).constructor")();

const db = new Nedb({filename:path.join(getConfig().dataPath, "handler.db"), autoload:true})
const ALLOWED_METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]

export class Handler extends BaseModel<Handler>{
	protected db: Nedb = db;
	_defaultValues = [
		{property:"enabled", value:true}
	]

	path:string;
	code:string;
	enabled:boolean;
	methods:string[];
	

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

	async validate():Promise<string>{
		this.path = (<string>this.path).toLowerCase();
		if (this.path[0] != "/"){
			this.path = "/" + this.path;
		}
		if (this.methods.length == 0){
			return "Handler should have at least 1 method"
		}
		for (let method of this.methods){
			if (ALLOWED_METHODS.indexOf(method) == -1){
				return `"${method}" is not a valid method. Please only use these methods: ` + ALLOWED_METHODS.join(", ");
			}
		}
		return null;
	}
}

export class HandlerQueryClass extends BaseQuery<Handler>{
	protected type: new (data: any) => Handler = Handler;
	protected db: Nedb = db;
	static default = new HandlerQueryClass();
}

export const HandlerQuery = HandlerQueryClass.default;