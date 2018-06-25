import Vue from 'vue';
import {BehaviorSubject} from "rxjs";

export class AuthService {
	isLoggedIn:BehaviorSubject<boolean> = new BehaviorSubject(false);
	
	login(){
		this.isLoggedIn.next(true);
	}
}

export const authService = new AuthService();