import * as bcrypt from "bcrypt";

import { getConfig } from "../config";
import { BaseModel } from "./base-model";
import * as path from 'path';

import * as Nedb from "nedb";

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

export class User extends BaseModel {
	protected db: Nedb = db;
	username:string;
	password:string;
	isAdmin:boolean;
	tokens:IToken[] = [];

	constructor(doc:any = null){
		super();
		if (!doc) return;
		this.parse(doc, ["username", "password", "isAdmin", "tokens"])
	}

	static async findById(id:string):Promise<User>{
		return User.findOne({_id:id});
	}

	static async find(query:any = null):Promise<User[]> {
		let promise = <Promise<User[]>>new Promise((resolve, reject)=>{
			db.find(query, (err, docs)=>{
				if (err){
					return reject(err);
				}
				resolve(docs.map(doc=>new User(doc)));
			})
		})
		return await promise;
	}

	static async findOne(query:any):Promise<User>{
		let promise = <Promise<User>>new Promise((resolve, reject)=>{
			db.findOne(query, (err, doc)=>{
				if (err){
					return reject(err);
				}
				resolve(new User(doc));
			});
		});
		return promise;
	}

	async comparePassword(password:string):Promise<boolean> {
		return await bcrypt.compare(password, this.password);
	}

	async setPassword(newPassword:string):Promise<void> {
		if (newPassword == null){
			return this.password = null;
		}
		
		let hash = await bcrypt.hash(newPassword, getConfig().saltRounds);
		this.password = hash;
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
		return;
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