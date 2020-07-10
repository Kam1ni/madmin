import { BaseModel, BaseQuery } from "./base-model";
import * as Nedb from "nedb";
import * as path from "path";
import { getConfig, IConfig } from "../utils/config";

const db = new Nedb({filename: path.join(getConfig().dataPath, "app-setting.db"), autoload: true});

export enum SETTINGS{
	DefaultRedirect = "defaultRedirect",
	DbVersion = "db-version"
}

export class AppSetting extends BaseModel<AppSetting>{
	protected db: Nedb = db;
	name:string = "";
	value:any;
	readonly:boolean = false;

	constructor(doc:any = null){
		super();
		if (!doc) return;
		this.parse(doc);
	}
}

class AppSettingQueryClass extends BaseQuery<AppSetting>{
	protected type: new (data: any) => AppSetting = AppSetting;
	protected db: Nedb = db;
	static default = new AppSettingQueryClass();
}

export const AppSettingQuery = AppSettingQueryClass.default;

export async function getSettings():Promise<{[key:string]:any}>{
	let configs = await AppSettingQuery.find();
	let result:{[key:string]:any} = {};
	for (let config of configs){
		result[config.name] = config.value;
	}
	return result;
}

export async function initializeSettings(){
	async function createSettingIfNotExists(name:string, defaultValue:any, readonly:boolean = false){
		let setting = await AppSettingQuery.findOne({name});
		if (!setting){
			setting = new AppSetting({name, value: defaultValue, readonly});
			await setting.save();
		}
	}

	await createSettingIfNotExists(SETTINGS.DefaultRedirect, "madmin");
}