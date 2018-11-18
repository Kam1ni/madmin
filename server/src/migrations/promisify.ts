import * as Nedb from "nedb";

interface IPromisedDB {
	find(query?:any):Promise<any[]>
	findOne(query?:any):Promise<any>
	insert(doc:any):Promise<any>
	update(query:any, doc:any):Promise<any>
	remove(query:any):Promise<any>
}

export const promisify = function(db:Nedb):IPromisedDB{
	let find = async function(query?:any):Promise<any[]>{
		return new Promise<any[]>((resolve, reject)=>{
			db.find(query, function(error, doc){
				if (error){
					return reject(error);
				}
				resolve(doc);
			})
		})
	}

	let findOne = async function(query?:any):Promise<any>{
		return new Promise<any>((resolve, reject)=>{
			db.findOne(query, function(error, doc){
				if (error){
					return reject(error);
				}
				resolve(doc);
			})
		})
	}

	let insert = async function(obj):Promise<any>{
		return new Promise<any>((resolve, reject)=>{
			db.insert(obj, function(error, doc){
				if (error){
					return reject(error);
				}
				resolve(doc);
			})
		})
	}

	let update = async function(query:any, doc:any):Promise<void>{
		return new Promise<void>((resolve, reject)=>{
			db.update(query, doc, {}, function(error, num, upsert){
				if (error){
					return reject(error);
				}
				resolve();
			})
		})
	}

	let remove = async function(query):Promise<void>{
		return new Promise<void>((resolve, reject)=>{
			db.remove(query, null, (err, n)=>{
				if (err){
					return reject(err);
				}
				resolve();
			})
		})
	}

	return {
		find,
		findOne,
		insert,
		update,
		remove,
	}
}