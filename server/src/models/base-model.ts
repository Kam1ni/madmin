import * as Nedb from "nedb";

export abstract class BaseModel<T extends BaseModel<T>>{
	_id:string;
	protected static db:Nedb;
	protected abstract db:Nedb;

	constructor(doc:any=null){
		if (!doc) return;
		this._id = doc._id;
	}

	async validate():Promise<string>{
		return null;
	}

	private getSaveableObject():any{
		let object:any = {}
		for (let key of Object.keys(this)){
			let value = this[key];
			if (key == "db")continue;
			if (typeof(key) == "function")continue;
			object[key] = value;
		}
		return object;
	}

	async save():Promise<any>{
		console.log("Validating");
		let validationError = await this.validate();
		if (validationError != null){
			throw new Error(validationError);
		}
		console.log("Creating save promise");
		if (!this._id){
			let promise = new Promise((resolve, reject)=>{
				this.db.insert(this.getSaveableObject(), (err, doc)=>{
					console.log(err)
					if (err){
						reject(err);
					}
					console.log(doc, this);
					resolve();
				})
			})
			return promise;
		}else{
			let promise = new Promise((resolve, reject)=>{
				this.db.update({_id:this._id}, this.getSaveableObject(), {multi:false}, (err)=>{
					console.log(err)
					if (err){
						reject(err);
					}
					resolve();
				})
			})
			return promise;
		}
	}

	protected parse(doc:any, fields:string[]){
		for (let field of fields){
			this[field] = doc[field];
		}
	}

	async remove():Promise<any>{
		return new Promise((resolve, reject)=>{
			this.db.remove({_id:this._id}, {multi:false}, (err)=>{
				if(err){
					return reject(err);
				}
				resolve();
			})
		})
	}

	
}

export abstract class BaseQuery<T extends BaseModel<T>>{
	protected abstract db:Nedb;
	protected abstract type:(new (data) => T);

	async findById(id:string):Promise<T>{
		return this.findOne({_id:id});
	}

	async find(query:any = null):Promise<T[]> {
		let promise = <Promise<T[]>>new Promise((resolve, reject)=>{
			this.db.find(query, (err, docs)=>{
				if (err){
					return reject(err);
				}
				resolve(docs.map(doc=>new this.type(doc)));
			})
		})
		return await promise;
	}

	async findOne(query:any):Promise<T>{
		console.log(this.type);
		console.log(typeof(this.type))
		let promise = <Promise<T>>new Promise((resolve, reject)=>{
			this.db.findOne(query, (err, doc)=>{
				if (err){
					return reject(err);
				}
				resolve(new this.type(doc));
			});
		});
		return promise;
	}
}