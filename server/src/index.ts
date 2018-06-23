import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as http from "http";

import {init} from "./init";
import {getConfig} from "./config";
import {mainRouter} from "./routes/main";

async function main(){
	await init();
	const config = getConfig();
	
	const app = express();
	app.use(cors());
	app.use(bodyParser.json());

	app.use(mainRouter);
	
	const server = http.createServer(app);
	server.listen(config.port, config.host, function(){
		console.log(`server started at ${config.host}:${config.port}`);
	});
}

main();