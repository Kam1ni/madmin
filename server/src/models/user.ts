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
}

export class User extends BaseModel<User> {
	protected db = db;
	username:string = "";
	password:string = "";
	isAdmin:boolean = false;

	public constructor(doc:any = null){
		super();
		if (!doc) return;
		this.parse(doc);
	}

	async comparePassword(password:string):Promise<boolean> {
		return await hashCompare(password, this.password);
	}

	async setPassword(newPassword:string):Promise<void> {
		let generatedHash = await hash(newPassword, getConfig().saltRounds);
		this.password = generatedHash;
	}

	getPublicJson():IPublicUser {
		let id = this._id;
		return {
			identifier: id || "<ID ERROR>",
			username: this.username,
			isAdmin: this.isAdmin,
		}
	}

	getPrivateJson():IPrivateUser{
		let privateUser = this.getPublicJson();
		return privateUser;
	}
}

export class UserQueryClass extends BaseQuery<User>{
	protected type: new (data: any) => User = User;
	protected db: Nedb = db;
	static default = new UserQueryClass();
}

export const UserQuery = UserQueryClass.default;