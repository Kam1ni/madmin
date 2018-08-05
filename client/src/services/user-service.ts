import Axios from "axios";
import { User } from '@/classes/user';
import { applicationConfig } from '@/app-config';
import { HeaderBuilder } from '@/classes/header-builder';

export class UserService {
	static readonly API_URL = applicationConfig.apiUrl + "/user";
	
	users:User[] = [];

	constructor(){
		this.getUsers();
	}

	async getUsers():Promise<User[]>{
		let response = await Axios.get(UserService.API_URL, {headers:HeaderBuilder.getDefaultHeaders()});
		this.users = (<any[]>response.data).map(d=>new User(d));
		return this.users;
	}

	async getUser(id:string):Promise<User>{
		let response = await Axios.get(UserService.API_URL + "/" + id, {headers:HeaderBuilder.getDefaultHeaders()});
		let user = new User(response.data);
		let i = this.users.findIndex(u=> u.id == id);
		if (i!=-1){
			this.users[i] = user;
		}else{
			this.users.push(user);
		}
		return user;
	}

}

export const userService = new UserService();