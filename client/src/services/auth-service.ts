import Vue from 'vue';
import {BehaviorSubject} from "rxjs";
import { User } from '@/classes/user';
import Axios, { AxiosResponse } from "axios";
import { applicationConfig } from '@/app-config';
import { HeaderBuilder } from '@/classes/header-builder';
import ClientJs from "clientjs";

export enum LoginState{
	default = 0,
	newPassword = 1
}

export class AuthService {
	static readonly API_URL:string = applicationConfig.apiUrl+"/auth";
	private static readonly LOCAL_STORAGE_TOKEN = "auth_token";
	private static readonly LOCAL_STORAGE_USER = "auth_user";
	user:BehaviorSubject<User> = new BehaviorSubject<User>(null);
	isLoggedIn:BehaviorSubject<boolean> = new BehaviorSubject(false);
	loginState:BehaviorSubject<LoginState> = new BehaviorSubject<LoginState>(LoginState.default);
	
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
		this.user.subscribe((u)=>{
			this.isLoggedIn.next(u!=null);
			if (u == null){
				localStorage.removeItem(AuthService.LOCAL_STORAGE_USER);
			}else{
				localStorage.setItem(AuthService.LOCAL_STORAGE_USER, JSON.stringify(u));
			}
		});
		
		Axios.interceptors.response.use((response)=>{
			return response;
		}, (error:AxiosResponse)=>{
			if (error.status == 400 && error.data.data == "NO PASSWORD"){
				this.isLoggedIn.next(false);
				this.loginState.next(LoginState.newPassword);
			}
			return Promise.reject(error);
		})
	}

	private checkIfLogedIn(){
		if (localStorage.getItem(AuthService.LOCAL_STORAGE_USER)){
			this.user.next(new User(JSON.parse(localStorage.getItem(AuthService.LOCAL_STORAGE_USER))));
			this.fetchProfile();
		}
	}

	async fetchProfile():Promise<User>{
		let response = await Axios.get(AuthService.API_URL, {headers:HeaderBuilder.getDefaultHeaders()} );
		let user = new User(response.data);
		this.user.next(user);
		return user;
	}

	async login(username:string, password:string):Promise<any>{
		try{
			let result = await Axios.post(AuthService.API_URL + "/login", {username, password, deviceName:this.getDiveceName()});
			this.user.next(new User(result.data));
			this._token = result.data.token;
		}catch(err){
			let ex:AxiosResponse = err;
			if (ex.status == 400 && ex.data.data == "NO PASSWORD"){
				this._token = ex.data.token;
				this.user.next(new User(ex.data));
				this.isLoggedIn.next(false);
			}
			else{
				throw err;
			}
		}
	}

	async setNewPassword(password:string):Promise<any>{
		let result = await Axios.post(AuthService.API_URL + "/set-new-password", {password}, {headers:HeaderBuilder.getDefaultHeaders()});
		this.loginState.next(LoginState.default);
		this.isLoggedIn.next(true);
	}

	async logout(){
		await Axios.post(AuthService.API_URL + "/logout", null, {headers:HeaderBuilder.getDefaultHeaders()});
		this.user.next(null);
		this.loginState.next(LoginState.default);
		this._token = null;
	}

	getDiveceName():string{
		let client = new ClientJs();
		return `${(<any>client.getBrowser()).name} @${(<any>client.getOS()).name}`;
	}

}

export const authService = new AuthService();