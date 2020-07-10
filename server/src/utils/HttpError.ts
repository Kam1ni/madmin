export class HttpError extends Error {
	code:number;
	data?:string;

	constructor(message:string, code:number = 500, data?:string){
		super(message);
		this.code = code;
		this.data = data;
		if (code == null){
			this.code = 500;
		}
	}
}