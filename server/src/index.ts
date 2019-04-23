import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as http from "http";
import * as https from "https";

import {init} from "./init/index";
import {getConfig} from "./config";
import { server } from "./functions/server";
import * as fs from "fs";

async function main(){
	await init();
	const config = getConfig();
	
	const app = express();
	app.use(cors());
	app.use(bodyParser.json({limit:"50mb", type:"application/json"}));
	app.use(bodyParser.urlencoded({extended:true}));

	const mainRouter = require("./routes/main").mainRouter;
	app.use(mainRouter);
	
	if (!config.sslKey){
		const server = http.createServer(app);
		server.listen(config.port, config.host, function(){
			console.log(`server started at ${config.host}:${config.port}`);
		});
	}else{
		if (config.redirectHttpToHttpsPort){
			const redirectApp = express();
			redirectApp.use(cors());
			redirectApp.use(function(req, res){
				let hostName = req.hostname.split(":")[0];
				res.redirect(`https://${hostName}:${config.port}/${req.path}`);
			})
			const redirectServer = http.createServer(redirectApp);
			redirectServer.listen(config.redirectHttpToHttpsPort, config.host, function(){
				console.log(`Redirect to https server started at ${config.host}:${config.redirectHttpToHttpsPort}`);
			})
		}
		const options = {
			key:fs.readFileSync(config.sslKey),
			cert:fs.readFileSync(config.sslCert)
		} as https.ServerOptions;

		const server = https.createServer(options, app);
		server.listen(config.port, config.host, function(){
			console.log(`server started at ${config.host}:${config.port}`);
		});
	}
}

main();