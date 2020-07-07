import { BaseModel, BaseQuery } from './base-model';
import * as Nedb from "nedb";
import * as path from "path";
import { getConfig } from "../utils/config";
import { AsyncFunction } from "../utils/async-function"
import { isStringNullOrWhiteSpace, stringHasWhiteSpace } from '../utils/string';

const db = new Nedb({filename:path.join(getConfig().dataPath, "script.db"), autoload:true})

function createValidityArray(start:number, end:number):string[]{
	let arr = ["*"] as string[];
	for (let i = start; i <= end; i++){
		arr.push(`${i}`);
	}
	return arr;
}

const validDaysOfTheWeek = createValidityArray(0, 6);
const validDaysOfMonth = createValidityArray(1, 31);
const validMonth = createValidityArray(0,11);
const validHour = createValidityArray(0,23);
const validMinut = createValidityArray(0, 59);

function isTimeValueValid(value:string, arr:string[]):boolean{
	return arr.indexOf(value) != -1;
}
export class Script extends BaseModel<Script> {
	protected db: Nedb = db;

	name:string = "";
	code:string = "";
	
	runAtStartUp:boolean = false;
	runAtInterval:boolean = false;
	dayOfTheWeek:string = "*";
	dayOfTheMonth:string = "*";
	month:string = "*";
	hour:string = "*";
	minut:string = "*";

	constructor(data:any = null){
		super(data);
	}

	async execute(madmin:any, args:any[]):Promise<number>{
		let fn = this.getFunction();
		let result = await fn(madmin, require, args);
		if (typeof(result) == "number"){
			return result;
		}
		return 0;
	}

	getFunction():(madmin:any, require:any, args:any[])=>Promise<number|void>{
		return new AsyncFunction("madmin", "require", "args", this.code);
	}

	async validate():Promise<string | null>{
		if (isStringNullOrWhiteSpace(this.name)){
			return "Name is required and cannot contain spaces."
		}
		if (stringHasWhiteSpace(this.name)){
			return "Name may not contain whitespace characters."
		}

		let foundScript = await ScriptQuery.findOne({_id:{$ne:this._id}, name:this.name});
		if (foundScript != null){
			return `Name must be unique. ${this.name} is already in use.`
		}
		try{
			this.getFunction();
		}catch(err){
			return `Error in your code.\n${err}`
		}
		if (this.runAtInterval){
			let valid = isTimeValueValid(this.dayOfTheWeek, validDaysOfTheWeek);
			if (!valid){
				return "Day of the week is not valid";
			}
			valid = isTimeValueValid(this.dayOfTheMonth, validDaysOfMonth);
			if (!valid){
				return "Day of the month is not valid";
			}
			valid = isTimeValueValid(this.month, validMonth);
			if (!valid){
				return "Month is not valid";
			}
			valid = isTimeValueValid(this.hour, validHour);
			if (!valid){
				return "Hour is not valid";
			}
			valid = isTimeValueValid(this.minut, validMinut);
			if (!valid){
				return "Minut is not valid";
			}
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