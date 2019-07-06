import { BaseModel, BaseQuery } from './base-model';
import * as Nedb from "nedb";
import * as path from "path";
import { getConfig } from "../config";
import { AsyncFunction } from "../functions/async-function"
import { isStringNullOrWhiteSpace, stringHasWhiteSpace } from '../../../client/src/functions/string';

const db = new Nedb({filename:path.join(getConfig().dataPath, "script.db"), autoload:true})

export class Script extends BaseModel<Script> {
	protected db: Nedb = db;

	name:string;
	code:string;

	constructor(data:any = null){
		super(data);
	}

	async execute(args:any[]):Promise<number>{
		let fn = this.getFunction();
		let result = await fn(args);
		if (typeof(result) == "number"){
			return result;
		}
		return 0;
	}

	getFunction():(args:any[])=>Promise<number|void>{
		return new AsyncFunction("args", this.code);
	}

	async validate():Promise<string>{
		if (isStringNullOrWhiteSpace(this.name)){
			return "Name is required and cannot contain spaces."
		}
		if (stringHasWhiteSpace(this.name)){
			return "Name may not contain whitespace characters."
		}

		let foundScript = ScriptQuery.findOne({_id:{$ne:this._id}, name:this.name});
		if (foundScript != null){
			return `Name must be unique. ${this.name} is already in use.`
		}
		try{
			this.getFunction();
		}catch(err){
			return `Error in your code.\n${err}`
		}
		return null;
	}
}

export class ScriptQueryClass extends BaseQuery<Script>{
	protected type: new (data:any) => Script = Script;
	protected db: Nedb = db;
	static default = new ScriptQueryClass();
}

export const ScriptQuery = ScriptQueryClass.default;