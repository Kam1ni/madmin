import { BaseResource } from './base-resource';
import Axios from 'axios';
import { ScriptService } from '@/services/script-service';
import { HeaderBuilder } from './header-builder';
import { scriptService } from '../services/script-service';
export class Script extends BaseResource{
	name:string;
	code:string;

	constructor(data:any = null){
		super(data);
		if(!data)return;
		this.name = data.name;
		this.code = data.code;
	}

	async save(){
		if (!this.created){
			let result = await Axios.post(ScriptService.API_URL, this, {headers:HeaderBuilder.getDefaultHeaders()});
			scriptService.scripts.push(new Script(result.data));
			this._created = true;
		}else{
			await Axios.put(`${ScriptService.API_URL}/${this.id}`, this, {headers:HeaderBuilder.getDefaultHeaders()});
			let index = scriptService.scripts.findIndex((item)=>{return item.id == this.id});
			if (index != -1){
				scriptService.scripts[index] = this;
			}else{
				scriptService.scripts.push(this);
			}
		}
	}

	async execute(args:any[]):Promise<void>{
		await Axios.post(`${ScriptService.API_URL}/${this.id}/execute/`, {args}, {headers:HeaderBuilder.getDefaultHeaders()});
	}

	async remove(){
		await Axios.delete(`${ScriptService.API_URL}/${this.id}`, {headers:HeaderBuilder.getDefaultHeaders()});
		this._created = false;
		let index = scriptService.scripts.findIndex((item)=>{return item.id == this.id});
		if (index != -1){
			scriptService.scripts.splice(index, 1);
		}
	}
}