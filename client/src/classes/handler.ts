import { BaseResource } from '@/classes/base-resource';
import Axios from 'axios';
import { HandlerService, handlerServcie } from '@/services/handler-service';
import { HeaderBuilder } from '@/classes/header-builder';

export class Handler extends BaseResource{
	path:string;
	code:string;

	constructor(data:any = null){
		super(data);
		if (!data) return;
		this.path = data.path;
		this.code = data.code;
	}

	async save(){
		if (!this.created){
			let result = await Axios.post(HandlerService.API_URL, this, {headers:HeaderBuilder.getDefaultHeaders()});
			handlerServcie.handlers.value.push(new Handler(result.data));
			this._created = true;
		}else{
			let result = await Axios.put(HandlerService.API_URL + "/" + this.id,  this, {headers:HeaderBuilder.getDefaultHeaders()});
			let index = handlerServcie.handlers.value.findIndex(i=>{return i.id == this.id});
			if (index != -1){
				handlerServcie.handlers.value[index] = new Handler(result.data);
			}else{
				handlerServcie.handlers.value.push(new Handler(result.data));
			}
		}
	}

	async remove(){
		let result = await Axios.delete(HandlerService.API_URL + "/" + this.id, {headers:HeaderBuilder.getDefaultHeaders()});
		let index = handlerServcie.handlers.value.findIndex(i=>{return i.id == this.id});
		if (index == -1) return;
		handlerServcie.handlers.value.splice(index, 1);
	}
}