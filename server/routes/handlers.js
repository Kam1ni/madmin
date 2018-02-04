const express = require("express");
const subdomain = require("express-subdomain");
const expressProxy = require("express-http-proxy");
const mongooseEvents = require("mongoose-events").EventNames;

const Proxy = require("../models/proxy");
const Webhook = require("../models/webhook");

const router = express.Router();

let proxies = [];

const updateProxies = async function(){
	try{
		console.log("FETCHING PROXIES")
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

router.use(subdomain("*", expressProxy(getHost, {memorizeHost:false})));

const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;

router.all("/hook/:hook", async function(req,res,next){
	res.json({});
	try{
		let webhook = await Webhook.findOne({path:req.params.hook});
		let handler = new AsyncFunction('body', webhook.handler);
		handler(req.body);
	}catch(err){
		next(err);
	}
});

module.exports = router;