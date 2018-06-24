import { IApp, IStaticApp } from "../models/app";
import { Request, Response } from "express";
import { resolve } from "path";
import * as fs from "fs";
import { promisify } from "util";

const lstatAsync = promisify(fs.lstat);
const readDirAsync = promisify(fs.readdir);

async function listFiles(path:string, res:Response){
	let dirContent = await readDirAsync(path);
	let response = "<!DOCTYPE html><html><body><ul>"
	for(let item of dirContent){
		response+=`<li><a href="${path}/${item}">${item}</a></li>`;
	}
	response+="</ul></body></html>";
	res.send(response);
}


export async function server(app:IApp, req:Request,res:Response){
	let config = (<IStaticApp>app.config);
	let basePath = config.path;
	let fullPath = resolve(basePath, req.path);
	let pathStats = await lstatAsync(fullPath);
	if (pathStats.isFile()){
		return res.sendFile(fullPath);
	}

	if (!config.listFiles){
		return res.status(404).send("Don't mind us. Nothing to see here :)")
	}

	listFiles(fullPath, res);
}