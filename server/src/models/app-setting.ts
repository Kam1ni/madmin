import { Schema, Mongoose, model, Document } from "mongoose";

interface IAppSetting extends Document{
	name:string;
	value:any;
	readonly:boolean;
}

const AppSettingSchema = new Schema({
	name:{required:true, unique:true, type:String},
	value:{required:true, type:Schema.Types.Mixed},
	readonly:{required:true, type:Boolean, default:false}
});

export const AppSetting = model<IAppSetting>("AppSetting", AppSettingSchema);

export enum SETTINGS{
	Version = "version",
	DefaultRedirect = "default-redirect",
}

export async function getSettings(){
	let configs = await AppSetting.find();
	let result = {};
	for (let config of configs){
		result[config.name] = config.value;
	}
	return result;
}

export async function initialiseSettings(){
	async function createSettingIfNotExists(name:string, defaultValue:any){
		let setting = await AppSetting.findOne({name});
		if (!setting){
			setting = new AppSetting({name, value:defaultValue});
			await setting.save();
		}
	}

	await createSettingIfNotExists(SETTINGS.DefaultRedirect, "madmin");
}