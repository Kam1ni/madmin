import Axios from 'axios';
import { AppConfig } from './conifg';

Axios.get("/manifest").then(response=>{
	interface IManifest {
		baseUrl:string;
		scriptsRunAtMinutIntervals:boolean;
	}
	let data = <IManifest>response.data;
	console.log(data.baseUrl)
	AppConfig.baseUrl = location.protocol + "//" + data.baseUrl;
	AppConfig.scriptsRunAtMinutIntervals = data.scriptsRunAtMinutIntervals;
	require("./app-init").appInit();
});