const express = require("express");
const subdomain = require("express-subdomain");
const expressProxy = require("express-http-proxy");
const mongooseEvents = require("mongoose-events").EventNames;
const path = require("path")

const Proxy = require("../models/proxy");
const Static = require("../models/static");

const router = express.Router();

let proxies = [];
const updateProxies = async function(){
	try{
		proxies = await Proxy.find({});
	}catch(err){
		console.error("FAILED TO FETCH PROXIES");
		console.error(err.message);
	}
}
updateProxies();

Proxy.on(mongooseEvents.ON_AFTER_CREATE, updateProxies);
Proxy.on(mongooseEvents.ON_AFTER_REMOVE, updateProxies);
Proxy.on(mongooseEvents.ON_AFTER_EDIT, updateProxies);

let statics = [];
const updateStatics = async function(){
	try{
		statics = await Static.find({});
	}catch(err){
		console.error("FAILED TO FETCH PROXIES");
		console.error(err.message);
	}
}
updateStatics();

Static.on(mongooseEvents.ON_AFTER_CREATE, updateStatics);
Static.on(mongooseEvents.ON_AFTER_REMOVE, updateStatics);
Static.on(mongooseEvents.ON_AFTER_EDIT, updateStatics);

const getHost = function(req){
	for (let proxy of proxies){
		if (proxy.subdomain == req.subdomains[0]){
			return proxy.endpoint;
		}
		if (req.subdomains.length >= 2 && proxy.subdomain == req.subdomains[1]){
			return proxy.endpoint;
		}
	}
	throw Error("No such proxy");
}

const staticRouter = express.Router();
router.use(subdomain("*", async function(req,res,next){
	for (let static of statics){
		if (static.subdomain == req.subdomains[0]){
			if (req.path == "/"){
				return res.sendFile(path.resolve(static.path, "index.html"));
			}
			return res.sendFile(path.resolve(static.path, req.path));
		}
		if (req.subdomains.length >= 2 && static.subdomain == req.subdomains[1]){
			if (req.path == "/"){
				return res.sendFile(path.resolve(static.path, "index.html"));
			}
			return res.sendFile(path.resolve(static.path, req.path));
		}
	}
	next();
}));

router.use(subdomain("*", expressProxy(getHost, {memorizeHost:false})));


router.use(function(err, req,res,next){
	console.error(err.message);
	console.error(err.stack);
	res.status(err.status || 500).json({message: err.message});
});

module.exports = router;