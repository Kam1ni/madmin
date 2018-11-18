import Vue from 'vue';
import {BehaviorSubject} from "rxjs";
import { User } from '@/classes/user';
import Axios, { AxiosResponse, AxiosError } from "axios";
import { HeaderBuilder } from '@/classes/header-builder';
import ClientJs from "clientjs";
import { Token } from '@/classes/token';
import { setLocalStorage, getLocalStorage } from '@/functions/storage';
import { BaseRoutes } from '@/classes/api';
import { ConfigService } from './config-service';

const API_URL:string = BaseRoutes.AUTH;
const LOCAL_STORAGE_TOKEN = "auth_token";
const LOCAL_STORAGE_USER = "auth_user";

export const authService = new Vue({
	data(){
		return {
			user:<User> null,
			token:<string> null
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
				let result = await Axios.post(API_URL + "/login", {username, password, deviceName:this.getDiveceName()});
				this.user = new User(result.data);
				this.token = result.data.token;
			}catch(err){
				let ex:AxiosResponse = err;
				if (ex.status == 400 && ex.data.data == "NO PASSWORD"){
					this.token = ex.data.token;
					this.user = new User(ex.data);
				}
				throw err;
			}
		},
		async setNewPassword(password:string):Promise<any>{
			let result = await Axios.post(API_URL + "/set-new-password", {password}, {headers:HeaderBuilder.getDefaultHeaders()});
		},
		async logout(){
			await Axios.post(API_URL + "/logout", null, {headers:HeaderBuilder.getDefaultHeaders()});
			this.user = null;
			this.token = null;
		},
		async removeToken(token:Token){
			await Axios.post(API_URL + "/logout", null, {headers:new HeaderBuilder().setAuthorization(false).setHeader("Authorization", token.token).build()});
			let userTokens = this.user.tokens;
			let index = userTokens.findIndex((t)=>{return t.token == token.token});
			if (index != -1){
				userTokens.splice(index, 1);
			}
		},
		getDiveceName():string{
			let client = new ClientJs();
			return `${(<any>client.getBrowser()).name} @${(<any>client.getOS()).name}`;
		},
		async removeAllTokens(){
			let message = await Axios.delete(API_URL + "/remove-all-tokens", {headers:HeaderBuilder.getDefaultHeaders()});
			this.user.tokens = message.data.tokens.map((t:any) => new Token(t));
		}
	},
	async created(){
		console.log("ADDING INTERCEPTORS");
		Axios.interceptors.response.use((response)=>{
			return response;
		}, (error:AxiosError)=>{
			// LOGOUT if token invalid
			if (!error.response){
				return error;
			}
			if (error.response.status == 400 && error.response.data.message == "Invalid token"){
				this.user = null;
				this.token = null;
			}
			return error;
		})
		this.token = getLocalStorage(LOCAL_STORAGE_TOKEN);
		if (this.isLoggedIn){
			this.user = new User(JSON.parse(getLocalStorage(LOCAL_STORAGE_USER, "{}")))
			await this.fetchProfile();
			await ConfigService.getSettings();
		}
	}
})