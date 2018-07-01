const mongoose = require("mongoose");

const schema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	friendlyName:{
		type: String,
		required: true,
		unique: true
	},
	description:{
		type:String,
		required: false
	},
	value: {
		type: mongoose.Schema.Types.Mixed,
		required: true
	}
});

schema.statics.findByName = async function(name){
	return await this.findOne({name});
}

module.exports = mongoose.model("Settings", schema);