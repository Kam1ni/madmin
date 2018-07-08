import { BehaviorSubject } from '../../node_modules/rxjs';
import { AppSettings } from '@/classes/app-settings';
import Axios from '../../node_modules/axios';
import { applicationConfig } from '@/app-config';
import { HeaderBuilder } from '@/classes/header-builder';

export class ConfigService{
	static readonly API_URL:string = applicationConfig.apiUrl + "/config";

	appSettings:BehaviorSubject<AppSettings> = new BehaviorSubject(null);

	constructor(){
		this.getSettings();
	}

	async getSettings():Promise<AppSettings>{
		let result = await Axios.get(ConfigService.API_URL, {headers:HeaderBuilder.getDefaultHeaders()});
		this.appSettings.next(new AppSettings(result.data));
		return this.appSettings.value;
	}
}

export const configService = new ConfigService();