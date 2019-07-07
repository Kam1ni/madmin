import { BaseRoutes } from '../classes/api';
import { Script } from '@/classes/script';
import Axios from 'axios';
import { HeaderBuilder } from '../classes/header-builder';
export class ScriptService {
	static readonly API_URL:string = BaseRoutes.SCRIPT;
	scripts:Script[] = null;

	async getScripts():Promise<Script[]>{
		let result = await Axios.get(ScriptService.API_URL, {headers:HeaderBuilder.getDefaultHeaders()});
		this.scripts = (<any[]>result.data).map(s=>new Script(s));
		return this.scripts;
	}

	async getScript(id:string):Promise<Script>{
		let result = await Axios.get(ScriptService.API_URL + "/" + id, {headers:HeaderBuilder.getDefaultHeaders()});
		return new Script(result.data);
	}

	scriptNameInUse(name:string, appId:string = null):boolean{
		if (this.scripts == null){
			this.getScripts();
			return false;
		}
		
		for (let script of this.scripts){
			if (script.name == name && script.id != appId){
				return true;
			}
		}
		return false;
	}
}

export const scriptService = new ScriptService();