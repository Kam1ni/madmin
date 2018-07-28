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
		let response = await Axios.get(UserService.API_URL, HeaderBuilder.getDefaultHeaders());
		this.users = (<any[]>response.data).map(d=>new User(d));
		return this.users;
	}

}

export const userService = new UserService();