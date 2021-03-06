import Vue from 'vue';
import { User } from '@/classes/user';
import Axios, { AxiosResponse, AxiosError } from "axios";
import { HeaderBuilder } from '@/classes/header-builder';
import { Token } from '@/classes/token';
import { setLocalStorage, getLocalStorage } from '@/functions/storage';
import { BaseRoutes } from '@/classes/api';
import { ConfigService } from './config-service';
import {getBrowserName, getClientOS} from "@/functions/client"


const API_URL:string = BaseRoutes.AUTH;
const LOCAL_STORAGE_TOKEN = "auth_token";
const LOCAL_STORAGE_USER = "auth_user";

export const authService = new Vue({
	data(){
		return {
			user: null as User | null, 
			token:null as string | null
		}
	},
	computed:{
		isLoggedIn():boolean{
			return this.token != null;
		}
	},
	watch:{
		user(newValue:User){
			setLocalStorage(LOCAL_STORAGE_USER, newValue)
		},
		token(newValue:string){
			setLocalStorage(LOCAL_STORAGE_TOKEN, newValue)
		}
	},
	methods:{
		async fetchProfile():Promise<User>{
			let response = await Axios.get(API_URL, {headers:HeaderBuilder.getDefaultHeaders()} );
			let user = new User(response.data);
			this.user = user;
			return user;
		},
		async login(username:string, password:string):Promise<any>{
			try{
				let result = await Axios.post(API_URL + "/login", {username, password});
				this.user = new User(result.data);
				this.token = result.data.token;
			}catch(err){
				let ex:AxiosResponse = err;
				if (ex.status == 400 && ex.data.data == "NO PASSWORD"){
					this.token = null;
					this.user = null;
				}
				throw err;
			}
		},
		logout(){
			this.token = null;
			this.user = null;
		},
		async setNewPassword(password:string):Promise<any>{
			let result = await Axios.post(API_URL + "/set-new-password", {password}, {headers:HeaderBuilder.getDefaultHeaders()});
		},
		async changePassword(oldPassword:string, newPassword:string):Promise<any>{
			let result = await Axios.post(`${API_URL}/change-password`, {oldPassword, newPassword}, {headers:HeaderBuilder.getDefaultHeaders()});
		},
	},
	async created(){
		console.log("ADDING INTERCEPTORS");
		Axios.interceptors.response.use((response)=>{
			return response;
		}, (error:AxiosError)=>{
			// LOGOUT if token invalid
			if (!error.response){
				throw error;
			}
			if (error.response.status == 400 && error.response.data.message == "Invalid token"){
				this.user = null;
				this.token = null;
			}
			throw error;
		})
		this.token = getLocalStorage(LOCAL_STORAGE_TOKEN);
		if (this.isLoggedIn){
			this.user = new User(JSON.parse(getLocalStorage(LOCAL_STORAGE_USER, "{}")))
			await this.fetchProfile();
			await ConfigService.getSettings();
		}
	}
})