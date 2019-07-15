import * as fs from "fs";

export function exists(path:string):Promise<boolean>{
	return new Promise(resolve=>fs.exists(path, resolve));
}

export function stat(path:string):Promise<fs.Stats> {
	return new Promise((resolve, reject)=>{
		fs.stat(path, function(err, stats){
			if (err){
				return reject(err)
			}
			resolve(stats)
		});
	});
}

export function readdir(path:string):Promise<string[]>{
	return new Promise((resolve, reject)=>{
		fs.readdir(path, function(err, files){
			if (err){
				return reject(err)
			}
			resolve(files);
		})
	})
}

export function readfile(path:string):Promise<string>{
	return new Promise((resolve, reject)=>{
		fs.readFile(path, "utf8", function(err, data){
			if (err){
				return reject(err);
			}
			resolve(data);
		})
	})
}