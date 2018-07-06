import { App } from '@/classes/app';
import { BehaviorSubject } from 'rxjs';
import Axios from 'axios';
import { applicationConfig } from '@/app-config';
import { HeaderBuilder } from '@/classes/header-builder';

export class AppService{
	static readonly API_URL:string = applicationConfig.apiUrl + "/app";
	apps:BehaviorSubject<App[]> = new BehaviorSubject(null);

	async getApps():Promise<App[]>{
		let result = await Axios.get(AppService.API_URL, {headers:HeaderBuilder.getDefaultHeaders()});
		this.apps.next((<any[]>result.data).map(d=>new App(d)));
		return this.apps.value;
	}

	async getApp(id:string):Promise<App>{
		let result = await Axios.get(AppService.API_URL + "/" + id, {headers:HeaderBuilder.getDefaultHeaders()});
		return new App(result.data);
	}

	domainInUse(domain:string, appId:string = null):boolean{
		if (this.apps.value == null){
			this.getApps();
			return false;
		}

		for (let app of this.apps.value){
			if (app.subdomain.toLowerCase() == domain.toLowerCase() && app.id != appId){
				return true;
			}
		}
		return false;
	}
}

export const appService = new AppService;