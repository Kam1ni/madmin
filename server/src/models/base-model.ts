import * as Nedb from "nedb";

interface IDefaultValue {
	property:string,
	value:any;
}

export abstract class BaseModel<T extends BaseModel<T>>{
	_id:string | undefined = undefined;
	protected static db:Nedb;
	protected abstract db:Nedb;
	protected readonly _ignoredFields:string[] = [];
	protected _defaultValues:IDefaultValue[] = [];

	private setProperty(key:string, val:any){
		let t = this as any;
		t[key] = val;
	}

	private getProperty(key:string):any{
		let t = this as any;
		return t[key];
	}

	toJSON():any{
		return this.getSaveableObject();
	}

	async validate():Promise<string | null>{
		return null;
	}

	private getSaveableObject():any{
		let object:any = {};
		for (let val of this._defaultValues){
			if (this.getProperty(val.property) === undefined){
				(this as any)[val.property] = val.value;
			}
		}
		for (let key of Object.keys(this)){
			if (key == "_ignoredFields" || this._ignoredFields.indexOf(key) != -1 || key == "_defaultValues"){
				continue;
			}
			let value = this.getProperty(key);
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
						console.error(err);
						reject(err);
					}
					this._id = doc._id;
					resolve();
				});
			});
			return promise;
		}
		let promise = new Promise((resolve, reject)=>{
			this.db.update({_id: this._id}, this.getSaveableObject(), {multi: false}, (err)=>{
				if (err){
					console.error(err);
					reject(err);
				}
				resolve();
			});
		});
		return promise;

	}

	protected parse(doc:any){
		for (let key of Object.keys(doc)){
			this.setProperty(key, doc[key]);
		}
	}

	async remove():Promise<any>{
		return new Promise((resolve, reject)=>{
			this.db.remove({_id: this._id}, {multi: false}, (err)=>{
				if(err){
					return reject(err);
				}
				resolve();
			});
		});
	}


}

export abstract class BaseQuery<T extends BaseModel<T>>{
	protected abstract db:Nedb;
	protected abstract type:(new (data?:any) => T);

	async findById(id:string):Promise<T|null>{
		return this.findOne({_id: id});
	}

	async find(query:any = null):Promise<T[]> {
		return new Promise((resolve:(res:T[])=>void, reject)=>{
			this.db.find(query, (err:Error, docs:any[])=>{
				if (err){
					return reject(err);
				}
				resolve(docs.map(doc=>new this.type(doc)));
			});
		});
	}

	async findOne(query:any):Promise<T | null>{
		let promise = <Promise<T | null>>new Promise((resolve, reject)=>{
			this.db.findOne(query, (err, doc)=>{
				if (err){
					return reject(err);
				}
				if (!doc){
					resolve(null);
				}
				resolve(new this.type(doc));
			});
		});
		return promise;
	}
}