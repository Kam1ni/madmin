import { Token } from '@/classes/token';
import { BaseResource } from '@/classes/base-resource';
import Axios from 'axios';
import { UserService, userService } from '@/services/user-service';
import { HeaderBuilder } from '@/classes/header-builder';

export class User extends BaseResource {
	constructor(data?:any){
		super(data);
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
	password:string;
	tokens:Token[] = [];
	
	async save(): Promise<any> {
		if (!this.created){
			let response = await Axios.post(UserService.API_URL, this, HeaderBuilder.getDefaultHeaders());
			userService.users.push(new User(response.data));
			this._created = true;
		}else{
			let repsonse = await Axios.put(UserService.API_URL + "/" + this.id, this, HeaderBuilder.getDefaultHeaders());
			let index = userService.users.findIndex((item)=>{return item.id == this.id});
			if (index != -1){
				userService.users[index] = this;
			}else{
				userService.users.push(this);
			}
		}
	}

	async remove(): Promise<any> {
		let response = await Axios.delete(UserService.API_URL + "/" + this.id, HeaderBuilder.getDefaultHeaders());
		let index = userService.users.findIndex((item)=>{return item.id == this.id});
		if (index != -1){
			userService.users.splice(index, 1);
		}
	}
}