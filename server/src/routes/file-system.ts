import { Router } from "express";
import { User } from "../models/user";
import { HttpError } from "../utils/HttpError";
import * as fs from "../utils/fs";
import * as path from "path";
import { File } from "../utils/fs-file";
import { Directory } from "../utils/fs-directory";
export const fileSystemRouter = Router();
import * as os from "os";

fileSystemRouter.use(function(req, res, next){
	if (!(<User>res.locals.user).isAdmin){
		return next(new HttpError("You are not allowed to access the filesystem", 403));
	}
	next();
});

fileSystemRouter.get("/*", async function(req, res, next){
	let requestPath = decodeURI(req.path);
	try{
		let exists = await fs.exists(requestPath);
		if (!exists){
			return next(new HttpError("Path does not exist", 404));
		}

		let stats = await fs.stat(requestPath);
		if (stats.isDirectory()){
			let items = await fs.readdir(requestPath);
			let result = {
				files: [] as File[],
				directories: [] as Directory[]
			};
			for (let item of items){
				try{
					let filePath = path.join(requestPath, item);
					let stat = await fs.stat(filePath);
					if (os.platform() == "win32"){
						filePath = filePath.replace(/\\/g, "/");
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

		//let content = await fs.readfile(requestPath);
		res.status(210).sendFile(requestPath);
	}catch(err){
		next(new HttpError(err, 500));
	}
});


fileSystemRouter.post("/mkdir/*", Router().post("/mkdir/*", async function(req, res, next){
	let requestPath = decodeURI(req.path);
	console.log(requestPath);

	try{
		let exists = await fs.exists(requestPath);
		if (exists){
			return next(new HttpError("Path already exists", 400));
		}

		let pathParts = requestPath.split("/");
		pathParts.pop();
		let parentPath = pathParts.join("/");
		exists = await fs.exists(parentPath);
		if (!exists){
			return next(new HttpError("Parent directory does not exist", 404));
		}

		let parentDirStats = await fs.stat(parentPath);
		if (!parentDirStats.isDirectory()){
			return next(new HttpError("Path is not a directory"));
		}

		fs.mkdir(requestPath);
		res.json({path: requestPath});
	}catch(err){
		next(new HttpError(err, 500));
	}
}));

fileSystemRouter.delete("/*", async function(req, res, next){
	let requestPath = decodeURI(req.path);
	try{
		let exists = await fs.exists(requestPath);
		if (!exists){
			return next(new HttpError("Path does not exist", 404));
		}

		await fs.rm(requestPath);
		res.json({});
	}catch(err){
		next(new HttpError(err, 500));
	}
});