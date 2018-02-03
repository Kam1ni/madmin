const mongoose = require("mongoose");

const schema = new mongoose.Schema({
	endpoint: {
		type:String,
		required: true
	}
});

module.exports = mongoose.model("Proxy", schema);