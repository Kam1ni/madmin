import Axios from "axios";
import { User } from '@/classes/user';
import { HeaderBuilder } from '@/classes/header-builder';
import Vue from 'vue';
import { BaseRoutes } from '@/classes/api';

const API_URL = BaseRoutes.USER;
console.log(API_URL)
export const userService = new Vue({
	data(){
		return {
			users:<User[]>[]
		}
	},
	methods:{
		async getUsers():Promise<User[]>{
			console.log("GETTING USERS", {API_URL});
			let response = await Axios.get(API_URL, {headers:HeaderBuilder.getDefaultHeaders()});
			console.log("GOT USERS")
			this.users = (<any[]>response.data).map(d=>new User(d));
			return this.users;
		},
		async getUser(id:string):Promise<User>{
			let response = await Axios.get(API_URL + "/" + id, {headers:HeaderBuilder.getDefaultHeaders()});
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
});