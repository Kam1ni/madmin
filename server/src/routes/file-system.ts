import { Router } from "express";
import { User } from "../models/user";
import { HttpError } from "../classes/HttpError";
import * as fs from "../functions/fs";
import * as path from "path"
import { File } from "../classes/fs-file";
import { Directory } from "../classes/fs-directory";
export const fileSystemRouter = Router();
import * as os from "os";

fileSystemRouter.use(function(req, res, next){
	if (!(<User>res.locals.user).isAdmin){
		return next(new HttpError("You are not allowed to access the filesystem", 403));
	}
	next();
});

fileSystemRouter.get("/*", async function(req, res, next){
	let requestPath = req.path;
	
	try{
		let exists = await fs.exists(requestPath);
		if (!exists){
			return new HttpError("Path does not exist", 404);
		}
		
		let stats = await fs.stat(requestPath);
		if (stats.isDirectory()){
			let items = await fs.readdir(requestPath);
			let result = {
				files:[] as File[],
				directories:[] as Directory[]
			}
			for (let item of items){
				try{
					let filePath = path.join(requestPath, item);
					let stat = await fs.stat(filePath);
					if (os.platform() == "win32"){
						filePath = filePath.replace(/\\/g, "/")
					}
					if (stat.isDirectory()){
						let dir = new Directory();
						dir.address = filePath;
						dir.name = item;
						result.directories.push(dir);
					}else{
						let file = new File();
						file.address = filePath;
						file.name = item;
						result.files.push(file);
					}
				}catch(err){

				}
			}
			return res.json(result);
		}
		
		let content = await fs.readfile(requestPath);
		res.send(content);
	}catch(err){
		next(new HttpError(err, 500));
	}
});