import {Schema, Document, model} from "mongoose";
import * as bcrypt from "bcrypt";

import { getConfig } from "../config";

export interface IPublicUser {
	isAdmin:boolean;
	username:string;
}

export interface IPrivateUser extends IPublicUser{
	tokens:[{
		token:string,
		deviceName:string
	}]
}

export interface IUser extends IPrivateUser, Document {
	password:string;
	
	comparePassword(password:string):Promise<boolean>;
	setPassword(newPassword:string):Promise<void>;
	getPublicJson():IPublicUser;
	getPrivateJson():IPrivateUser;
	addToken(token:string, name?:string);
	removeToken(token:string);
	removeAllTokens(currentToken:string);
}

const UserSchema = new Schema({
	username:{type:String, required:true},
	password:{type:String, requried:true},
	isAdmin:{type:Boolean, required:false, default:false},
	tokens:[
		{
			token:{type:String, required:true, unique:true},
			deviceName:{type:String, required:true, unique:true}
		}
	]
})

UserSchema.methods.setPassword = async function(newPassword:string):Promise<void>{
	if (newPassword == null){
		return this.password = null;
	}
	
	let hash = await bcrypt.hash(newPassword, getConfig().saltRounds);
	this.password = hash;
}

UserSchema.methods.comparePassword = async function(password:string):Promise<boolean>{
	return await bcrypt.compare(password, this.password);
}

UserSchema.methods.getPublicJson = function():IPublicUser{
	return {
		username: this.username,
		isAdmin: this.isAdmin,
	}
}

UserSchema.methods.getPrivateJson = function():IPrivateUser{
	let user = this.getPublicJson();
	user.tokens = this.tokens;
	return user;
}

UserSchema.methods.addToken = function(token:string, name:string = null){
	if (name == null){
		name = new Date().toUTCString();
	}

	this.tokens.push({token:token, deviceName:name});
}

UserSchema.methods.removeAllTokens = function(currentToken:string){
	let user = <IUser>this;
	user.tokens.reverse().forEach((token)=>{
		if (token.token != currentToken) {
			user.tokens.splice(user.tokens.indexOf(token), 1);
		}
	});
	console.log("remove end");
}

export const User = model<IUser>("User", UserSchema);