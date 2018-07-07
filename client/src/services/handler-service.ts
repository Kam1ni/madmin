import { applicationConfig } from '@/app-config';
import { BehaviorSubject } from 'rxjs';
import { Handler } from '@/classes/handler';
import Axios from 'axios';
import { HeaderBuilder } from '@/classes/header-builder';

export class HandlerService{
	static readonly API_URL:string = applicationConfig.apiUrl + "/handler";
	handlers:BehaviorSubject<Handler[]> = new BehaviorSubject(null);

	async getHandlers():Promise<Handler[]>{
		let result = await Axios.get(HandlerService.API_URL, {headers:HeaderBuilder.getDefaultHeaders()});
		this.handlers.next(result.data.map((d:any)=>new Handler(d)));
		return this.handlers.value;
	}

	async getHandler(id:string):Promise<Handler>{
		let result = await Axios.get(HandlerService.API_URL + "/" + id, {headers:HeaderBuilder.getDefaultHeaders()});
		return new Handler(result.data);
	}

	isPathInUse(path:string, id:string = null):boolean{
		if (!this.handlers.value){
			this.getHandlers();
			return false;
		}
		for (let handler of this.handlers.value){
			if (handler.path.toLowerCase() == path){
				if (handler.id != id){
					return true;
				}
			}
		}
		return false;
	}
}

export const handlerServcie = new HandlerService();