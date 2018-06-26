import Axios from 'axios';
Axios.interceptors.response.use((response)=>{
	return response
}, (error)=>{
	return Promise.reject(error.response);
})

interface Config {
	devMode:boolean
	apiUrl:string
}

let apiUrl = process.env.VUE_APP_API_URL;

if (apiUrl == "/"){
	apiUrl = window.location.protocol + "://" + window.location.host;
}

if (apiUrl.endsWith("/")){
	apiUrl = apiUrl.slice(0,-1);
}

export const applicationConfig:Config = {
	devMode: process.env.NODE_ENV == "development",
	apiUrl: apiUrl
}