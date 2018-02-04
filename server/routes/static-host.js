const express = require("express");
const Static = require("../models/static");

const router = express.Router();

router.get("/", async function(req,res,next){
	try{
		res.json(await Static.find());
	}catch(err){
		next(err);
	}
});

router.get("/:id", async function(req,res,next){
	try{
		res.json(await Static.findById(req.params.id));
	}catch(err){
		next(err);
	}
});

router.post("/", async function(req,res,next){
	try{
		let static = new Static(req.body);
		await static.save();
		res.json(static);
	}catch(err){
		next(err);
	}
});

router.put("/:id", async function(req,res,next){
	try{
		let static = await Static.findById(req.params.id);
		static.set(req.body);
		await static.save();
		res.json(static);
	}catch(err){
		next(err);
	}
});

router.delete("/:id", async function(req,res,next){
	try{
		let static = await Static.findById(req.params.id);
		await static.remove();
		res.json({});
	}catch(err){
		next(err);
	}
})

module.exports = router;