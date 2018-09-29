import * as Nedb from "nedb";

interface IDefaultValue {
	property:string,
	value:any;
}

export abstract class BaseModel<T extends BaseModel<T>>{
	_id:string;
	protected static db:Nedb;
	protected abstract db:Nedb;
	protected readonly _ignoredFields:string[] = [];
	protected _defaultValues:IDefaultValue[] = [];

	constructor(doc:any=null){
		if (!doc) return;
		for (let key of Object.keys(doc)){
			this[key] = doc[key];
		}
	}

	toJSON():any{
		return this.getSaveableObject();
	}

	async validate():Promise<string>{
		return null;
	}

	private getSaveableObject():any{
		let object:any = {}
		for (let val of this._defaultValues){
			if (this[val.property] === undefined){
				this[val.property] = val.value;
			}
		}
		for (let key of Object.keys(this)){
			if (key == "_ignoredFields" || this._ignoredFields.indexOf(key) != -1 || key == "_defaultValues"){
				continue;
			}
			let value = this[key];
			if (key == "db")continue;
			if (typeof(key) == "function")continue;
			object[key] = value;
		}
		return object;
	}

	async save():Promise<any>{
		let validationError = await this.validate();
		if (validationError != null){
			throw new Error(validationError);
		}
		if (!this._id){
			let promise = new Promise((resolve, reject)=>{
				this.db.insert(this.getSaveableObject(), (err, doc)=>{
					if (err){
						console.error(err)
						reject(err);
					}
					this._id = doc._id;
					resolve();
				})
			})
			return promise;
		}else{
			let promise = new Promise((resolve, reject)=>{
				this.db.update({_id:this._id}, this.getSaveableObject(), {multi:false}, (err)=>{
					if (err){
						console.error(err)
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