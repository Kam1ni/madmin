import { configInit } from "./config";

export async function init(){
	console.log("INIT");
	configInit();
	const data = await require("./data");
	await data.dataInit();
	await require("./settings").settingsInit();
	await require("./auth").authInit();
}