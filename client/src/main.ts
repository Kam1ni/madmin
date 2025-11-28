import Axios from 'axios';
import { AppConfig } from './conifg';

Axios.get("/manifest").then(response=>{
	interface IManifest {
		baseUrl:string;
        apiUrl:string;
		scriptsRunAtMinutIntervals:boolean;
	}
	let data = <IManifest>response.data;
	AppConfig.baseUrl = location.protocol + "//" + data.baseUrl;
	AppConfig.scriptsRunAtMinutIntervals = data.scriptsRunAtMinutIntervals;
    AppConfig.apiUrl = location.protocol + "//" + data.apiUrl;
	require("./app-init").appInit();
});
