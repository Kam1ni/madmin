export abstract class BaseResource{
	protected _id:string;
	get id():string {
		return this._id;
	}

	protected _created:boolean = false;
	get created():boolean{
		return this._created;
	}

	constructor(data:any){
		if (!data) return;
		this._created = true;
		this._id = data._id;
	}

	abstract async save():Promise<any>;

	abstract async remove():Promise<any>;
}