const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const cors = require("cors");
const init = require("./init/init");

init().then(function(){
	const serverConfig = require("./config/server.json");
	const app = express();

	app.use(cors());
	app.use(bodyParser.json());

	const server = http.createServer(app);
	server.listen(serverConfig.port, serverConfig.host, function(err){
		if(err){
			console.error("Could not start server");
			console.error(err.message);
			console.error(err.stack);
			process.exit(-1);
		}
		console.log(`Server running at ${serverConfig.host}:${serverConfig.port}`);
	});
}).catch(function(err){
	console.error(err.message);
	console.error(err.stack);
	process.exit(-1);
});