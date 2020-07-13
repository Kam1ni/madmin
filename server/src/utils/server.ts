import { App, IStaticApp } from "../models/app";
import { Request, Response } from "express";
import { join } from "path";
import * as serveStatic from "serve-static";
import { exists, lstat, readdir } from "./fs";


async function listFiles(host:string, urlPath:string, path:string, res:Response){
	let dirContent = await readdir(path);
	let response = "<!DOCTYPE html><html><body><ul>";
	for(let item of dirContent){
		response+=`<li><a href="${host}${urlPath}${item}">${item}</a></li>`;
	}
	response+="</ul></body></html>";
	res.send(response);
}

export async function server(app:App, req:Request,res:Response){
	let config = (<IStaticApp>app.config);
	let serve = serveStatic(config.path, {fallthrough: false});
	let basePath = config.path;
	async function return404(){
		if (config.error404File) {
			let path404 = join(basePath, config.error404File);
			try{
				if (await exists(path404)) {
					return res.sendFile(path404);
				}
			}catch(err){
				console.error("Static file 404 error", path404);
				console.error(err);
			}
		}
		return res.status(404).send("FILE DOES NOT EXIST");
	}

	serve(req, res, async (err:any)=>{
		if (!err) return;
		let path = req.path;
		if (path == ""){
			path = "/";
		}
		if (!path.match(/^\//)){
			path = "/" + path;
		}
		path = decodeURIComponent(path);
		let fullPath = join(basePath, path);
		try{
			if (!await exists(fullPath)){
				return return404();
			}
			let pathStats = await lstat(fullPath);
			if (pathStats.isDirectory()){
				if (!config.listFiles){
					return return404();
				}
				let host = req.protocol + "://" + req.get("host");
				return listFiles(host, path, fullPath, res);
			}
			return return404();
		}catch(err){
			console.error("Static file server error");
			console.error(err);
			return return404();
		}
	});
}