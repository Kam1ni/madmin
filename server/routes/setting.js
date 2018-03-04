const express = require("express");
const Setting = require("../models/setting");

const router = express.Router();

router.get("/", async function(req,res,next){
	try{
		res.json(await settings.find());
	}catch(err){
		next(err);
	}
});

router.get("/:setting", async function(req,res,next){
	try{
		res.json(await settings.findByName(req.params.setting))
	}catch(err){
		next(err);
	}
});

router.put("/:setting", async function(req,res,next){
	try{
		let setting = await setting.findByName(req.params.setting);
		setting.value = req.body.value;
		await setting.save();
		res.json(setting);
	}catch(err){
		next(err);
	}
});

module.exports = router;