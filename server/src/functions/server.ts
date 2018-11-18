import { App, IStaticApp } from "../models/app";
import { Request, Response } from "express";
import { resolve, join } from "path";
import * as fs from "fs";
import { promisify } from "util";

const lstatAsync = promisify(fs.lstat);
const readDirAsync = promisify(fs.readdir);

async function listFiles(host:string, urlPath:string, path:string, res:Response){
	let dirContent = await readDirAsync(path);
	let response = "<!DOCTYPE html><html><body><ul>"
	for(let item of dirContent){
		response+=`<li><a href="${host}${urlPath}${item}">${item}</a></li>`;
	}
	response+="</ul></body></html>";
	res.send(response);
}


export async function server(app:App, req:Request,res:Response){
	let path = req.path;
	if (!path.match(/\/$/)){
		path = path += "/"
	}
	if (!path.match(/^\//)){
		path = "/" + path;
	}
	path = decodeURIComponent(path)
	let config = (<IStaticApp>app.config);
	let basePath = config.path;
	let fullPath = join(basePath, path);
	let pathStats = await lstatAsync(fullPath);
	if (pathStats.isFile()){
		return res.sendFile(fullPath);
	}

	if (!config.listFiles){
		return res.status(404).send("Don't mind us. Nothing to see here :)")
	}

	let host = req.protocol + "://" + req.get("host");
	listFiles(host, path, fullPath, res);
}