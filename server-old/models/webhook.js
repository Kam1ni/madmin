const mongoose = require("mongoose");

const schema = new mongoose.Schema({
	path: {
		type:String,
		required: true,
		unique: true
	},
	handler: {
		type:String,
		required: true
	}
});

module.exports = mongoose.model("Webhook", schema);