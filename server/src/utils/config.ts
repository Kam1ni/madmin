import * as fs from "fs";

export interface IConfig {
	dataPath:string;
	port:number;
    serverPort?:number;
	host:string;
	baseUrl:string;
    apiUrl:string;
	saltRounds:number;
	tokenSecret:string;
	clientDomain:string;
	sslKey:string | null;
	sslCert:string | null;
	redirectHttpToHttpsPort:number | null;
	runScriptsAtMinutIntervals:boolean;
}

export interface IClientConfig {
	baseUrl:string;
    apiUrl:string;
	scriptsRunAtMinutIntervals:boolean;
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
		baseUrl: `${config.baseUrl}:${config.port}`,
        apiUrl: `${config.apiUrl}:${config.port}`,
		scriptsRunAtMinutIntervals: config.runScriptsAtMinutIntervals,
	};
}
