export interface IConfig {
	dataPath:string;
	port:number;
	host:string;
	baseUrl:string;
	saltRounds:number;
	tokenSecret:string;
	clientDomain:string;
}

export function getConfig():IConfig{
	let config:IConfig = require("../config/config.json");
	return config;
}