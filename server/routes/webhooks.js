const express = require("express");
const Webhook = require("../models/webhook");

const router = express.Router();

router.get("/", async function(req,res,next){
	try{
		res.json(await Webhook.find({}));
	}catch(err){
		next(err);
	}
});

router.get("/:id", async function(req,res,next){
	try{
		res.json(await Webhook.findById(req.params.id));
	}catch(err){
		next(err);
	}
});

router.post("/", async function(req,res,next){
	try{
		let hook = new Webhook(req.body);
		await hook.save();
		res.json(hook);
	}catch(err){
		next(err);
	}
});

router.put("/:id", async function(req,res,next){
	try{
		let hook = Webhook.findById(req.params.id);
		hook.set(req.body);
		await hook.save();
		res.json(hook);
	}catch(err){
		next(err);
	}
});

router.delete("/:id", async function(req,res,next){
	try{
		let hook = Webhook.findById(req.params.id);
		await hook.remove();
		res.json({});
	}catch(err){
		next(err);
	}
})

module.exports = router;