import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as http from "http";

import {init} from "./init/index";
import {getConfig} from "./config";

async function main(){
	await init();
	const config = getConfig();
	
	const app = express();
	app.use(cors());
	app.use(bodyParser.json({limit:"50mb", type:"application/json"}));
	app.use(bodyParser.urlencoded({extended:true}));
	app.use(bodyParser());

	const mainRouter = require("./routes/main").mainRouter;
	app.use(mainRouter);
	
	const server = http.createServer(app);
	server.listen(config.port, config.host, function(){
		console.log(`server started at ${config.host}:${config.port}`);
	});
}

main();