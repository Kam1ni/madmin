export abstract class FsObject {
	name:string;
	address:string;
	
	constructor(data?:any){
		if (!data) return;
		this.name = data.name;
		this.address = data.address;
	}

	abstract isDirectory():boolean;
}