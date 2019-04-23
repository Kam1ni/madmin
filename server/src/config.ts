import * as fs from "fs"

export interface IConfig {
	dataPath:string;
	port:number;
	host:string;
	baseUrl:string;
	saltRounds:number;
	tokenSecret:string;
	clientDomain:string;
	sslKey:string;
	sslCert:string;
	redirectHttpToHttpsPort:number;
}

export interface IClientConfig {
	baseUrl:string;
}

let config:IConfig;

export function setConfig(conf:IConfig){
	config = conf;
}

export function getConfig():IConfig{
	return config;
}

export function getClientConfig():IClientConfig{
	return {
		baseUrl:`${config.baseUrl}:${config.port}`
	}
}