const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const cors = require("cors");
const init = require("./init/init");

init().then(function(){
	const serverConfig = require("./config/server.json");
	const app = express();
	const mAuth = require("./middlewares/auth");

	app.use(cors());
	app.use(bodyParser.json());

	app.use("/auth", require("./routes/auth"));
	app.use("/proxy", mAuth.authenticate, require("./routes/proxy"));
	app.use("/webhook", mAuth.authenticate, require("./routes/webhooks"));
	app.use(require("./routes/handlers"))

	app.use(function(err, req,res,next){
		console.error(err.message);
		console.error(err.stack);
		res.status(err.status || 500).json({message: err.message});
	});

	app.use("/", express.static("public"));
	app.all("/", function(req,res){
		res.sendFile("./public/index.html");
	});

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