import Axios from 'axios';
import { AppService, appService } from '@/services/app-service';
import { HeaderBuilder } from '@/classes/header-builder';

export interface IStaticAppConfig{
	path:string;
	listFiles:boolean;
}

export interface IProxyAppConfig{
	url:string;
}

export class App {
	_id:string;
	subdomain:string;
	enabled:boolean;
	type:"static"|"proxy";
	config:IProxyAppConfig|IStaticAppConfig;
	private _created:boolean = false;

	constructor(data:any = null){
		if (!data) return;
		this._created = true;
		this.subdomain = data.subdomain;
		this.enabled = data.enabled;
		this.type = data.type;
		this.config = data.config;
	}

	async save(){
		if (!this._created){
			await Axios.post(AppService.API_URL, this, {headers:HeaderBuilder.getDefaultHeaders()});
			appService.apps.value.push(this);
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
		appService.apps.value.splice(appService.apps.value.indexOf(this), 1);
	}
}