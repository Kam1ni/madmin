import Vue from 'vue';
import {BehaviorSubject} from "rxjs";
import { User } from '@/classes/user';
import Axios, { AxiosResponse } from "axios";
import { applicationConfig } from '@/app-config';
import { HeaderBuilder } from '@/classes/header-builder';
import ClientJs from "clientjs";
import { Token } from '@/classes/token';

export class AuthService {
	static readonly API_URL:string = applicationConfig.apiUrl+"/auth";
	private static readonly LOCAL_STORAGE_TOKEN = "auth_token";
	private static readonly LOCAL_STORAGE_USER = "auth_user";
	private _user:User = null;
	set user(user:User){
		this._user = user;
		localStorage.setItem(AuthService.LOCAL_STORAGE_USER, JSON.stringify(user));
		if (user == null){
			localStorage.removeItem(AuthService.LOCAL_STORAGE_USER);
		}
	}
	get user():User{
		return this._user;
	}
	
	get token():string{
		return localStorage.getItem(AuthService.LOCAL_STORAGE_TOKEN);
	}
	private set _token(token:string){
		if (!token){
			localStorage.removeItem(AuthService.LOCAL_STORAGE_TOKEN);
		}else{
			localStorage.setItem(AuthService.LOCAL_STORAGE_TOKEN, token);
		}
	}
	
	constructor(){
		// Check if loged in
		this.checkIfLogedIn();
		
		Axios.interceptors.response.use((response)=>{
			return response;
		}, (error:AxiosResponse)=>{
			// LOGOUT if token invalid
			if (error.status == 400 && error.data.message == "Invalid token"){
				this.user = null;
				this._token = null;
			}
			return Promise.reject(error);
		})
	}

	private checkIfLogedIn(){
		if (localStorage.getItem(AuthService.LOCAL_STORAGE_USER)){
			this.user = new User(JSON.parse(localStorage.getItem(AuthService.LOCAL_STORAGE_USER)));
			this.fetchProfile();
		}
	}

	isUserLogedIn():boolean{
		return this.token != null;
	}

	async fetchProfile():Promise<User>{
		let response = await Axios.get(AuthService.API_URL, {headers:HeaderBuilder.getDefaultHeaders()} );
		let user = new User(response.data);
		this.user = user;
		return user;
	}

	async login(username:string, password:string):Promise<any>{
		try{
			let result = await Axios.post(AuthService.API_URL + "/login", {username, password, deviceName:this.getDiveceName()});
			this.user = new User(result.data);
			this._token = result.data.token;
		}catch(err){
			let ex:AxiosResponse = err;
			if (ex.status == 400 && ex.data.data == "NO PASSWORD"){
				this._token = ex.data.token;
				this.user = new User(ex.data);
			}
			else{
				throw err;
			}
		}
	}

	async setNewPassword(password:string):Promise<any>{
		let result = await Axios.post(AuthService.API_URL + "/set-new-password", {password}, {headers:HeaderBuilder.getDefaultHeaders()});
	}

	async logout(){
		await Axios.post(AuthService.API_URL + "/logout", null, {headers:HeaderBuilder.getDefaultHeaders()});
		this.user = null;
		this._token = null;
	}

	async removeToken(token:Token){
		await Axios.post(AuthService.API_URL + "/logout", null, {headers:new HeaderBuilder().setAuthorization(false).setHeader("Authorization", token.token).build()});
		let userTokens = this.user.tokens;
		let index = userTokens.findIndex((t)=>{return t.token == token.token});
		if (index != -1){
			userTokens.splice(index, 1);
		}
	}

	getDiveceName():string{
		let client = new ClientJs();
		return `${(<any>client.getBrowser()).name} @${(<any>client.getOS()).name}`;
	}

	async removeAllTokens(){
		let message = await Axios.delete(AuthService.API_URL + "/remove-all-tokens", {headers:HeaderBuilder.getDefaultHeaders()});
		this.user.tokens = message.data.tokens.map((t:any) => new Token(t));
	}

}

export const authService:AuthService = new AuthService();