import { Schema, Mongoose, model, Document } from "mongoose";
import { BaseModel, BaseQuery } from "./base-model";
import * as Nedb from "nedb";
import * as path from "path";
import { getConfig, IConfig } from "../config";

const db = new Nedb({filename:path.join(getConfig().dataPath, "app-setting.db"), autoload:true})

export enum SETTINGS{
	Version = "version",
	DefaultRedirect = "defaultRedirect",
}

export class AppSetting extends BaseModel<AppSetting>{
	protected db: Nedb = db;
	name:string;
	value:any;
	readonly:boolean = false;

	constructor(data:any = null){
		super(data);
	}
}

export class AppSettingQuery extends BaseQuery<AppSetting>{
	protected type: new (data: any) => AppSetting = AppSetting;
	protected db: Nedb = db;
	static default = new AppSettingQuery();
}


export async function getSettings(){
	let configs = await AppSettingQuery.default.find();
	let result = {};
	for (let config of configs){
		result[config.name] = config.value;
	}
	return result;
}

export async function initialiseSettings(){
	async function createSettingIfNotExists(name:string, defaultValue:any, readonly:boolean = false){
		let setting = await AppSettingQuery.default.findOne({name});
		if (!setting){
			setting = new AppSetting({name, value:defaultValue, readonly});
			await setting.save();
		}
	}

	await createSettingIfNotExists(SETTINGS.DefaultRedirect, "madmin");

	let version = require("../../package.json").version;
	await createSettingIfNotExists(SETTINGS.Version, version, true);
	let versionSetting = await AppSettingQuery.default.findOne({name:SETTINGS.Version});
	if (version != versionSetting.value){
		// TODO: CREATE MIGRATION SERVICE
		console.warn("Migration required");
	}
}