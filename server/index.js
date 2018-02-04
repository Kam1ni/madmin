const express = require("express");
const subdomain = require("express-subdomain");
const http = require("http");
const bodyParser = require("body-parser");
const cors = require("cors");
const init = require("./init/init");
const path = require("path");

init().then(function(){
	const serverConfig = require("./config/server.json");
	const app = express();
	const mAuth = require("./middlewares/auth");

	app.use(cors());
	app.use(bodyParser.json());

	app.all("/*", function(req,res,next){
		if (req.subdomains.length == 0 || (req.subdomains.length == 1 && req.subdomains[0] == "localhost")){
			res.redirect(`${req.protocol}://madmin.${req.get("host")}${req.originalUrl}`);
		}
		else{
			next();
		}
	});

	const router = express.Router();
	router.use("/auth", require("./routes/auth"));
	router.use("/proxy", mAuth.authenticate, require("./routes/proxy"));
	router.use("/webhook", mAuth.authenticate, require("./routes/webhooks"));
	router.use("/hook", require("./routes/hook-handler"));
	
	router.use(function(err, req,res,next){
		console.error(err.message);
		console.error(err.stack);
		res.status(err.status || 500).json({message: err.message});
	});
	
	router.use("/", express.static("public"));
	router.all("/*", function(req,res){
		res.sendFile(path.resolve(__dirname, "./public/index.html"));
	});

	
	app.use(subdomain("madmin", router));
	app.use(subdomain("madmin.localhost", router));
	app.use(require("./routes/subdomain"));
	
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