export interface IDatabaseConfig{
	host:string;
	database:string;
	username?:string;
	password?:string;
}

export interface IConfig {
	database:IDatabaseConfig;
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