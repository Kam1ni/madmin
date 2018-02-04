const express = require("express");
const expressProxy = require("express-http-proxy");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

const Webhook = require("../models/webhook");

const router = express.Router();

const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
router.all("/:hook", async function(req,res,next){
	console.log("POSIT")
	res.json({});
	try{
		let webhook = await Webhook.findOne({path:req.params.hook});
		console.log(webhook);
		let handler = new AsyncFunction('body', 'exec', webhook.handler);
		handler(req.body, exec);
	}catch(err){
		next(err);
	}
});

module.exports = router;