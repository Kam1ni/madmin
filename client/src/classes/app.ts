import Axios from 'axios';
import { AppService, appService } from '@/services/app-service';
import { HeaderBuilder } from '@/classes/header-builder';
import { applicationConfig } from '@/app-config';

export interface IStaticAppConfig{
	path:string;
	listFiles:boolean;
}

export interface IProxyAppConfig{
	url:string;
}

export class App {
	private _id:string;
	subdomain:string;
	enabled:boolean;
	type:"static"|"proxy";
	config:IProxyAppConfig|IStaticAppConfig;
	private _created:boolean = false;

	get id():string{
		return this._id;
	}

	constructor(data:any = null){
		if (!data) return;
		this._created = true;
		this._id = data._id;
		this.subdomain = data.subdomain;
		this.enabled = data.enabled;
		this.type = data.type;
		this.config = data.config;
	}

	get fullUrl():string{
		let url = applicationConfig.baseUrl.split("//");
		return url[0] + "//" + this.subdomain + "." + url[1];
	}

	async save(){
		if (!this._created){
			let result = await Axios.post(AppService.API_URL, this, {headers:HeaderBuilder.getDefaultHeaders()});
			appService.apps.value.push(new App(result.data));
			this._created = true;
		}else{
			await Axios.put(AppService.API_URL + "/" + this._id, this, {headers:HeaderBuilder.getDefaultHeaders()});
		}
	}

	async enable(){
		await Axios.put(AppService.API_URL + "/" + this._id + "/enable", null, {headers:HeaderBuilder.getDefaultHeaders()});
		this.enabled = true;
	}

	async disable(){
		await Axios.put(AppService.API_URL + "/" + this._id + "/disable", null, {headers:HeaderBuilder.getDefaultHeaders()});
		this.enabled = false;
	}

	async remove(){
		await Axios.delete(AppService.API_URL + "/" + this._id, {headers:HeaderBuilder.getDefaultHeaders()});
		this._created = false;
		let index = appService.apps.value.findIndex((item)=>{return item.id == this.id});
		if (index != -1){
			appService.apps.value.splice(index, 1);
		}
	}
}