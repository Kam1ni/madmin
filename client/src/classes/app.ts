import Axios from 'axios';
import { AppService, appService } from '@/services/app-service';
import { HeaderBuilder } from '@/classes/header-builder';
import { BaseResource } from '@/classes/base-resource';
import { AppConfig } from '@/conifg';

export interface IStaticAppConfig{
	path:string;
	listFiles:boolean;
	error404File?:string;
}

export interface IProxyAppConfig{
	url:string;
}

export class App extends BaseResource{
	subdomain:string;
	enabled:boolean = true;
	type:"static"|"proxy";
	config:IProxyAppConfig|IStaticAppConfig;
	domainName:string|null;

	get enabledWeb():boolean{
		return this.enabled;
	}

	set enabledWeb(val:boolean){
		if (val){
			this.enable();
		}else{
			this.disable();
		}
	}

	constructor(data:any = null){
		super(data);
		if (!data) return;
		this.subdomain = data.subdomain;
		this.enabled = data.enabled == null ? true : data.enabled;
		this.type = data.type;
		this.config = data.config;
		this.domainName = data.domainName;
	}

	get fullUrl():string{
		let url = AppConfig.baseUrl.split("//");
		return url[0] + "//" + this.subdomain + "." + url[1];
	}

	async save(){
		if (!this.created){
			let result = await Axios.post(AppService.API_URL, this, {headers:HeaderBuilder.getDefaultHeaders()});
			appService.apps.push(new App(result.data));
			this._created = true;
		}else{
			await Axios.put(AppService.API_URL + "/" + this.id, this, {headers:HeaderBuilder.getDefaultHeaders()});
			let index = appService.apps.findIndex((item)=>{return item.id == this.id});
			if (index != -1){
				appService.apps[index] = this;
			}else{
				appService.apps.push(this);
			}
		}
	}

	async enable(){
		await Axios.put(AppService.API_URL + "/" + this.id + "/enable", null, {headers:HeaderBuilder.getDefaultHeaders()});
		this.enabled = true;
	}

	async disable(){
		await Axios.put(AppService.API_URL + "/" + this.id + "/disable", null, {headers:HeaderBuilder.getDefaultHeaders()});
		this.enabled = false;
	}

	async remove(){
		await Axios.delete(AppService.API_URL + "/" + this.id, {headers:HeaderBuilder.getDefaultHeaders()});
		this._created = false;
		let index = appService.apps.findIndex((item)=>{return item.id == this.id});
		if (index != -1){
			appService.apps.splice(index, 1);
		}
	}
}