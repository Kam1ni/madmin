import { IApp, IProxyApp } from "../models/app";
import { Request, Response } from "express";
import * as http from "http";
import * as url from "url";
import Axios, { AxiosRequestConfig, AxiosError } from "axios";

export async function proxy(app:IApp, req:Request, res:Response){
	try{
		let config = <IProxyApp>app.config;
		let parsedUrl = url.parse(config.url + req.path);
		let options:AxiosRequestConfig = {
			url: parsedUrl.href,
			method:req.method,
			data:req.body,
			headers:req.headers,
			responseType:"arraybuffer"
		}
		let response = await Axios(options);
		res.set(response.headers);
		res.status(response.status);
		res.send(new Buffer(response.data, 'binary'));
	}catch(err){
		let axiosError = <AxiosError>err;
		console.log(err);
		if (axiosError.response){
			res.set(axiosError.response.headers)
			res.status(axiosError.response.status);
			res.send(axiosError.response.data);
		}else{
			res.status(500).json({message:"Proxy error"});
		}
	}
}