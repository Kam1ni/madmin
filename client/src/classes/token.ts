export class Token {
	token:string;
	deviceName:string;

	constructor(token:any){
		this.token = token.token;
		this.deviceName = token.deviceName;
	}
}