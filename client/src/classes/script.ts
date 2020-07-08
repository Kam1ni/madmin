import { BaseResource } from './base-resource';
import Axios from 'axios';
import { ScriptService } from '@/services/script-service';
import { HeaderBuilder } from './header-builder';
import { scriptService } from '../services/script-service';
export class Script extends BaseResource{
	name:string;
	code:string;

	runAtStartUp:boolean = false;
	runAtInterval:boolean = false
	dayOfTheWeek:string = "*";
	dayOfTheMonth:string = "*";
	month:string = "*";
	hour:string = "*";
	minut:string = "*";

	constructor(data:any = null){
		super(data);
		if(!data)return;
		this.parse(data);
	}

	parse(data:any){
		this._id = data._id;
		this.name = data.name;
		this.code = data.code;
		this.runAtStartUp = data.runAtStartUp;
		this.runAtInterval = data.runAtInterval;
		this.dayOfTheMonth = data.dayOfTheMonth;
		this.dayOfTheWeek = data.dayOfTheWeek;
		this.month = data.month;
		this.hour = data.hour;
		this.minut = data.minut;
	}

	async save(){
		if (!this.created){
			let result = await Axios.post(ScriptService.API_URL, this, {headers:HeaderBuilder.getDefaultHeaders()});
			this.parse(result.data as any);
			scriptService.scripts.push(new Script(result.data));
			this._created = true;
		}else{
			let result = await Axios.put(`${ScriptService.API_URL}/${this.id}`, this, {headers:HeaderBuilder.getDefaultHeaders()});
			this.parse(result.data);
			let index = scriptService.scripts.findIndex((item)=>{return item.id == this.id});
			if (index != -1){
				scriptService.scripts[index] = new Script(result.data);
			}else{
				scriptService.scripts.push(new Script(result.data));
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