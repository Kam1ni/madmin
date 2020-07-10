import * as fs from "fs";
import * as pathjs from "path";

export function exists(path:string):Promise<boolean>{
	return new Promise(resolve=>fs.exists(path, resolve));
}

export function stat(path:string):Promise<fs.Stats> {
	return new Promise((resolve, reject)=>{
		fs.stat(path, function(err, stats){
			if (err){
				return reject(err);
			}
			resolve(stats);
		});
	});
}

export function readdir(path:string):Promise<string[]>{
	return new Promise((resolve, reject)=>{
		fs.readdir(path, function(err, files){
			if (err){
				return reject(err);
			}
			resolve(files);
		});
	});
}

export function readfile(path:string):Promise<string>{
	return new Promise((resolve, reject)=>{
		fs.readFile(path, "utf8", function(err, data){
			if (err){
				return reject(err);
			}
			resolve(data);
		});
	});
}

export function mkdir(path:string):Promise<void>{
	return new Promise((resolve, reject)=>{
		fs.mkdir(path, function(err){
			if (err){
				return reject(err);
			}
			resolve();
		});
	});
}

export async function rm(path:string):Promise<void>{
	let stat:fs.Stats = await new Promise((resolve, reject)=>{
		fs.stat(path, function(err, stats){
			if (err){
				return reject(err);
			}
			resolve(stats);
		});
	});

	return new Promise(async (resolve, reject)=>{
		if (stat.isFile()){
			fs.unlink(path, (err)=>{
				if (err){
					return reject(err);
				}
				return resolve();
			});
		}else{
			try{
				let items = await readdir(path);
				for (let item of items){
					let fullPath = pathjs.join(path, item);
					await rm(fullPath);
				}
			}catch(err){
				reject(err);
			}
		}
	});
}