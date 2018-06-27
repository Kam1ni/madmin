import { App } from '@/classes/app';
import { BehaviorSubject } from 'rxjs';
import Axios from 'axios';
import { applicationConfig } from '@/app-config';
import { HeaderBuilder } from '@/classes/header-builder';

export class AppService{
	static readonly API_URL:string = applicationConfig.apiUrl + "/app";
	apps:BehaviorSubject<App[]> = new BehaviorSubject([]);

	async getApps():Promise<App[]>{
		let result = await Axios.get(AppService.API_URL, {headers:HeaderBuilder.getDefaultHeaders()});
		this.apps.next((<any[]>result.data).map(d=>new App(d)));
		return this.apps.value;
	}
}

export const appService = new AppService;