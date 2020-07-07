import { getConfig } from "../utils/config";
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
	error404File?:string;
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
	
	subdomain:string = "";
	domainName:string | null = null;
	type:AppTypes = AppTypes.static;
	config:IProxyApp|IStaticApp = {
		path:"",
		listFiles:true,
	};
	enabled:boolean = true;

	async validate():Promise<string | null>{
		this.subdomain = this.subdomain.toLowerCase();
		if (this.enabled === undefined){
			this.enabled = true;
		}

		if (!!/\s/.test(this.subdomain)){
			return "Subdomain may not have spaces";
		}

		if (this.type == "static"){
			let conf = this.config as IStaticApp;
			if (conf.path == null){
				return "Invalid configuration";
			}
			if (conf.error404File){
				if (conf.error404File.match(/^\s*$/)){
					conf.error404File = undefined;
				}
			}
		}
		else if (this.type == "proxy"){
			if ((<IProxyApp>this.config).url == null){
				return "Invalid configuration";
			}
		}
		let app = await AppQuery.findOne({subdomain:this.subdomain, _id:{$ne: this._id}});
		if (app != null){
			return `subdomain "${this.subdomain}" already in use`
		}
		if (this.domainName && /^\s*$/.exec(this.domainName)){
			this.domainName = null;
		}else{
			app = await AppQuery.findOne({domainName:this.domainName, _id:{$ne:this._id}});
		}
		return null;
	}


}

class AppQueryClass extends BaseQuery<App>{
	protected type: new (data: any) => App = App;
	protected db: Nedb = db;
	static default = new AppQueryClass();
	async findBySubdomain(subDomain:string):Promise<App | null> {
		let apps = await this.find({enabled:true});
		for (let app of apps){
			let domain = app.subdomain.replace(".", "\\.");
			domain = domain.replace("*", "[0-9a-zA-Z-_\\.]*");
			let regex = new RegExp(`^${domain}$`, "g");
			if (regex.exec(subDomain)){
				return app;
			}
		}
		return null;
	}
}

export const AppQuery = AppQueryClass.default;