import { IApp, IProxyApp } from "../models/app";
import { Request, Response } from "express";
import * as http from "http";

export async function proxy(app:IApp, req:Request, res:Response){
	let config = <IProxyApp>app.config;
	let options:http.RequestOptions = {
		host:config.url,
		path:req.path,
		method:req.method,
		headers: req.headers,
	};

	let request = http.request(options, function(response){
		response.setEncoding("utf8");
		let receivedData = [];
		response.on("data", (chunk)=>{
			receivedData.push(chunk);
		});
		res.set(response.headers);
		response.on("end", ()=>{
			res.send(receivedData.join(""));
		});
	});

	if (req.body){
		request.write(JSON.stringify(req.body));
	}
	request.end();
}