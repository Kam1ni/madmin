const mongoose = require("mongoose");

module.exports = async function(){
	const authConfig = require("../config/auth.json");
	const serverConfig = require("../config/server.json");
	const User = require("../models/user");
	await mongoose.connect(serverConfig.db.host + "/" + serverConfig.db.database);
	console.log("Connected to database");
	for (let confUser of authConfig.users){
		let user = await User.findById(confUser._id);
		if (!user){
			user = new User();
		}
		user.set(confUser);
		await user.save();
		console.log(`${user.isNew ? "Created" : "Updated"} user ${user.username}`);
	}
}