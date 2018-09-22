import * as Nedb from "nedb";

export abstract class BaseModel{
	_id:string;
	protected abstract db:Nedb;

	constructor(doc:any=null){
		if (!doc) return;
		this._id = doc._id;
	}

	async validate():Promise<string>{
		return null;
	}

	async save(){
		let validationError = await this.validate();
		if (validationError != null){
			throw new Error(validationError);
		}
		let promise = new Promise((resolve, reject)=>{
			this.db.update({_id:this._id}, this, {multi:false, upsert:true}, (err)=>{
				if (err){
					reject(err);
				}
			})
		})
		await promise;
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