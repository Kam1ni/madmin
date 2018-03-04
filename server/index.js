const express = require("express");
const subdomain = require("express-subdomain");
const http = require("http");
const bodyParser = require("body-parser");
const cors = require("cors");
const init = require("./init/init");
const path = require("path");
const Setting = require("./routes/setting");

init().then(function(){
	const serverConfig = require("./config/server.json");
	const app = express();
	const mAuth = require("./middlewares/auth");

	const bodyParserJsonMiddleware = function () {
		return function (req, res, next) {
			let contentTypeHeader = req.headers['content-type'];
			let isMultipartRequest = contentTypeHeader && contentTypeHeader.indexOf('multipart') > -1;
			if (isMultipartRequest) {
				return next();
			}
			return bodyParser.json()(req, res, next);
		};
	};

	app.use(cors());
	app.use(bodyParserJsonMiddleware());

	app.all("/*", async function(req,res,next){
		if (req.subdomains.length == 0 || (req.subdomains.length == 1 && req.subdomains[0] == "localhost")){
			let redirect = await Setting.findByName("defaultSubDomain");
			res.redirect(`${req.protocol}://${redirect.value}.${req.get("host")}${req.originalUrl}`);
		}
		else{
			next();
		}
	});

	const router = express.Router();
	router.use("/auth", require("./routes/auth"));
	router.use("/proxy", mAuth.authenticate, require("./routes/proxy"));
	router.use("/static-host", mAuth.authenticate, require("./routes/static-host"));
	router.use("/webhook", mAuth.authenticate, require("./routes/webhooks"));
	router.use("/hook", require("./routes/hook-handler"));
	router.use("/settings", mAuth.authenticate, require("./routes/setting"));
	
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