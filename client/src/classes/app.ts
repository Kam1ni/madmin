import Axios from 'axios';
import { AppService, appService } from '@/services/app-service';
import { HeaderBuilder } from '@/classes/header-builder';
import { applicationConfig } from '@/app-config';
import { BaseResource } from '@/classes/base-resource';

export interface IStaticAppConfig{
	path:string;
	listFiles:boolean;
}

export interface IProxyAppConfig{
	url:string;
}

export class App extends BaseResource{
	subdomain:string;
	enabled:boolean = true;
	type:"static"|"proxy";
	config:IProxyAppConfig|IStaticAppConfig;

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
	}

	get fullUrl():string{
		let url = applicationConfig.baseUrl.split("//");
		return url[0] + "//" + this.subdomain + "." + url[1];
	}

	async save(){
		if (!this.created){
			let result = await Axios.post(AppService.API_URL, this, {headers:HeaderBuilder.getDefaultHeaders()});
			appService.apps.value.push(new App(result.data));
			this._created = true;
		}else{
			await Axios.put(AppService.API_URL + "/" + this.id, this, {headers:HeaderBuilder.getDefaultHeaders()});
			let index = appService.apps.value.findIndex((item)=>{return item.id == this.id});
			if (index != -1){
				appService.apps.value[index] = this;
			}else{
				appService.apps.value.push(this);
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
		let index = appService.apps.value.findIndex((item)=>{return item.id == this.id});
		if (index != -1){
			appService.apps.value.splice(index, 1);
		}
	}
}