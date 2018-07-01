const express = require("express");
const expressProxy = require("express-http-proxy");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

const Webhook = require("../models/webhook");

const router = express.Router();

const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
router.all("/:hook", async function(req,res,next){
	res.json({});
	try{
		let webhook = await Webhook.findOne({path:req.params.hook});
		let handler = new AsyncFunction('body', 'exec', webhook.handler);
		await handler(req.body, exec);
	}catch(err){
		console.log(err.message);
		console.log(err.stack);
	}
});

module.exports = router;