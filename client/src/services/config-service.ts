import { BehaviorSubject } from '../../node_modules/rxjs';
import { AppSettings } from '@/classes/app-settings';
import Axios from 'axios';
import { HeaderBuilder } from '@/classes/header-builder';
import { BaseRoutes } from '@/classes/api';
import Vue from 'vue';

const API_URL:string = BaseRoutes.CONFIG;
export const ConfigService = new Vue({
	data(){
		return {
			appSettings:<AppSettings|null>null
		}
	},
	methods:{
		async getSettings():Promise<AppSettings>{
			let result = await Axios.get(API_URL, {headers:HeaderBuilder.getDefaultHeaders()});
			this.appSettings = new AppSettings(result.data);
			return this.appSettings;
		},
		async updateSetting(name:string, value:any){
			await Axios.put(API_URL + "/" + name, {value}, {headers:HeaderBuilder.getDefaultHeaders()});
			(<any>this.appSettings)[name] = value;
		}
	}
});