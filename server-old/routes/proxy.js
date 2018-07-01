const express = require("express");
const Proxy = require("../models/proxy");

const router = express.Router();

router.get("/", async function(req,res,next){
	try{
		res.json(await Proxy.find());
	}catch(err){
		next(err);
	}
});

router.get("/:id", async function(req,res,next){
	try{
		res.json(await Proxy.findById(req.params.id));
	}catch(err){
		next(err);
	}
});

router.post("/", async function(req,res,next){
	try{
		let proxy = new Proxy(req.body);
		await proxy.save();
		res.json(proxy);
	}catch(err){
		next(err);
	}
});

router.put("/:id", async function(req,res,next){
	try{
		let proxy = await Proxy.findById(req.params.id);
		proxy.set(req.body);
		await proxy.save();
		res.json(proxy);
	}catch(err){
		next(err);
	}
});

router.delete("/:id", async function(req,res,next){
	try{
		let proxy = await Proxy.findById(req.params.id);
		await proxy.remove();
		res.json({});
	}catch(err){
		next(err);
	}
});

module.exports = router;