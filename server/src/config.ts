export interface IDatabaseConfig{
	host:string;
	database:string;
	username?:string;
	password?:string;
}

export interface ISecurityConfig{
	bcryptSecret:string,
}

export interface IConfig {
	database:IDatabaseConfig;
	port:number;
	host:string;
	security:ISecurityConfig,
	baseUrl:string
}

export function getConfig():IConfig{
	let config:IConfig = require("../config/config.json");
	return config;
}