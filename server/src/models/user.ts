import { getConfig } from "../utils/config";
import { BaseModel, BaseQuery } from "./base-model";
import * as path from 'path';

import * as Nedb from "nedb";
import { hashCompare, hash } from "../utils/hash";

const db = new Nedb({filename:path.join(getConfig().dataPath, "user.db"), autoload:true})

interface IToken{
	token:string;
	deviceName:string;
}

export interface IPublicUser {
	identifier: string;
	username: string;
	isAdmin: boolean;
}

export interface IPrivateUser extends IPublicUser{
	tokens:IToken[];
}

export class User extends BaseModel<User> {
	protected db = db;
	username:string = "";
	password:string = "";
	isAdmin:boolean = false;
	tokens:IToken[] = [];

	constructor(doc:any = null){
		super(doc);
		if (!this.tokens) {
			this.tokens = []
		}
	}

	async comparePassword(password:string):Promise<boolean> {
		return await hashCompare(password, this.password);
	}

	async setPassword(newPassword:string):Promise<void> {
		if (newPassword == null){
			this.password = "";
			return;
		}
		let generatedHash = await hash(newPassword, getConfig().saltRounds);
		this.password = generatedHash;
	}

	getPublicJson():IPublicUser {
		let id = this._id;
		return {
			identifier: id,
			username: this.username,
			isAdmin: this.isAdmin,
		}
	}

	getPrivateJson():IPrivateUser{
		let privateUser = <IPrivateUser>this.getPublicJson();
		privateUser.tokens = this.tokens;
		return privateUser;
	}

	addToken(token:string, name?:string){
		if (name == null){
			name = new Date().toUTCString();
		}
		this.tokens.push({token:token, deviceName:name});
	}

	removeToken(token:string){
		this.tokens.reverse().forEach((t)=>{
			if (t.token == token) {
				this.tokens.splice(this.tokens.indexOf(t), 1);
			}
		});
	}

	removeAllTokens(currentToken:string){
		this.tokens.reverse().forEach((token)=>{
			if (token.token != currentToken) {
				this.tokens.splice(this.tokens.indexOf(token), 1);
			}
		});
	}
}

export class UserQueryClass extends BaseQuery<User>{
	protected type: new (data: any) => User = User;
	protected db: Nedb = db;
	static default = new UserQueryClass();
}

export const UserQuery = UserQueryClass.default;