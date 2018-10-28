import { initialiseSettings } from "../models/app-setting";

export async function settingsInit(){
	await initialiseSettings();
}