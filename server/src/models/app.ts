import {Schema, Document, model} from "mongoose";
import { getConfig } from "../config";
import { BaseModel, BaseQuery } from "./base-model";
import * as path from 'path';

import * as Nedb from "nedb";

const db = new Nedb({filename:path.join(getConfig().dataPath, "app.db"), autoload:true})

export interface IProxyApp {
	url:string;
}

export interface IStaticApp {
	path:string;
	listFiles:boolean;
}

enum AppTypes{
	static = "static",
	proxy = "proxy"
}


export class App extends BaseModel<App>{
	protected db: Nedb = db;
	_defaultValues = [
		{property:"enabled",value:true}
	]
	
	subdomain:string;
	type:AppTypes;
	config:IProxyApp|IStaticApp;
	enabled:boolean;

	async validate():Promise<string>{
		this.subdomain = this.subdomain.toLowerCase();
		if (this.enabled === undefined){
			this.enabled = true;
		}

		if (!!/\s/.test(this.subdomain)){
			return "Subdomain may not have spaces";
		}

		if (this.type == "static"){
			if ((<IStaticApp>this.config).path == null){
				return "Invalid configuration";
			}
		}
		else if (this.type == "proxy"){
			if ((<IProxyApp>this.config).url == null){
				return "Invalid configuration";
			}
		}
		let app = await AppQuery.default.findOne({subdomain:this.subdomain, _id:{$ne: this._id}});
		if (app != null){
			return `subdomain "${this.subdomain}" already in use`
		}
		return null;
	}
}

export class AppQuery extends BaseQuery<App>{
	protected type: new (data: any) => App = App;
	protected db: Nedb = db;
	static default = new AppQuery();
}