import Axios from 'axios';
import { AppConfig } from './conifg';

Axios.get("/manifest").then(response=>{
	interface IManifest {
		baseUrl:string;
	}
	let data = <IManifest>response.data;
	console.log(data.baseUrl)
	AppConfig.baseUrl = location.protocol + "//" + data.baseUrl;
	require("./app-init").appInit();
})
