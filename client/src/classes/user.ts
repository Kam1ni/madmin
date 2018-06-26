import { Token } from '@/classes/token';

export class User {
	constructor(data?:any){
		if (!data) return;
		this.username = data.username;
		this.isAdmin = data.isAdmin;
		
		if (data.tokens){
			for (let token of data.tokens){
				this.tokens.push(new Token(token));
			}
		}
	}

	isAdmin:boolean;
	username:string;
	tokens:Token[] = [];
}