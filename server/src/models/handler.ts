import {Request, Response} from "express";
import * as Nedb from "nedb";
import * as path from "path";
import { getConfig } from "../utils/config";
import { BaseModel, BaseQuery } from "./base-model";
import { exec } from "child_process";
import { AsyncFunction } from "../utils/async-function"

const db = new Nedb({filename:path.join(getConfig().dataPath, "handler.db"), autoload:true})
const ALLOWED_METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]

export class Handler extends BaseModel<Handler>{
	protected db: Nedb = db;
	_defaultValues = [
		{property:"enabled", value:true}
	]

	path:string = "";
	code:string = "";
	enabled:boolean = true;
	methods:string[] = [];
	

	constructor(doc:any = null){
		super();
		if (!doc) return;
		this.parse(doc)
	}

	async execute(madmin:any, request:Request, response:Response){
		try{
			let fn = this.getFunction();
			await fn(madmin, request, response, require);
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

	getFunction():(madmin:any, Request:Request,Response:Response,require:NodeRequire)=>Promise<void>{
		return new AsyncFunction("madmin", "req", "res", "require", this.code);
	}

	async validate():Promise<string | null>{
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