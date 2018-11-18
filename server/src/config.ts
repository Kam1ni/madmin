import * as fs from "fs"

export interface IConfig {
	dataPath:string;
	port:number;
	host:string;
	baseUrl:string;
	saltRounds:number;
	tokenSecret:string;
	clientDomain:string;
}

let config:IConfig;

export function setConfig(conf:IConfig){
	config = conf;
}

export function getConfig():IConfig{
	return config;
}