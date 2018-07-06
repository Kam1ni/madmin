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

	domainInUse(domain:string):boolean{
		if (this.apps.value == null){
			this.getApps();
			return false;
		}

		for (let app of this.apps.value){
			if (app.subdomain.toLowerCase() == domain.toLowerCase()){
				return true;
			}
		}
		return false;
	}
}

export const appService = new AppService;