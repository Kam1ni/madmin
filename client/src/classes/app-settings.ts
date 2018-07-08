export class AppSettings{
	defaultRedirect:string;
	version:string;

	constructor(data:any){
		this.defaultRedirect = data.defaultRedirect;
		this.version = data.version;
	}
}