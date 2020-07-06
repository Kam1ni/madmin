import * as Nedb from "nedb";
import * as path from "path";
import { getConfig, IConfig } from "../config";
import { SETTINGS } from "../models/app-setting";
import { promisify } from "./promisify";
const SettingsDB = promisify(new Nedb({filename:path.join(getConfig().dataPath, "app-setting.db"), autoload:true}));

let versions = [1];

export const DB_VERSION = 1;

export async function migrate(){
	let currentVersion = await SettingsDB.findOne({name:SETTINGS.DbVersion});
	if (currentVersion.value < DB_VERSION){
		console.log("Migrating")


		currentVersion.value = DB_VERSION;
		await SettingsDB.update({name:SETTINGS.DbVersion}, currentVersion);
	}
}