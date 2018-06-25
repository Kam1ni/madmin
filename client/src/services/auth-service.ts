import Vue from 'vue';
import {BehaviorSubject} from "rxjs";
import { User } from '@/classes/user';

export enum LoginState{
	default = 0,
	newPassword = 1
}

export class AuthService {
	user:BehaviorSubject<User> = new BehaviorSubject<User>(null);
	isLoggedIn:BehaviorSubject<boolean> = new BehaviorSubject(false);
	loginState:BehaviorSubject<LoginState> = new BehaviorSubject<LoginState>(LoginState.default);
	
	constructor(){
		// Check if loged in
		this.user.subscribe((u)=>{
			this.isLoggedIn.next(u!=null);
		})
	}

	async login(username:string, password:string):Promise<any>{
		return new Promise(resolve=>{
			setTimeout(()=>{
				this.loginState.next(LoginState.newPassword);
				resolve();
			}, 1500);
		});
	}

	cancelLogin(){
		this.user.next(null);
		this.loginState.next(LoginState.default);
	}
}

export const authService = new AuthService();