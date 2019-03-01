import { initializeSettings } from "../models/app-setting";

export async function settingsInit(){
	await initializeSettings();
}