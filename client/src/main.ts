import Axios from 'axios';
import { AppConfig } from './conifg';

Axios.get("/manifest").then(response=>{
	interface IManifest {
		baseUrl:string;
	}
	let data = <IManifest>response.data;
	console.log(data.baseUrl)
	AppConfig.baseUrl = "http://" + data.baseUrl;
	require("./app-init").appInit();
})
