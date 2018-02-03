const mongoose = require("mongoose");
const mongooseBcrypt = require("mongoose-bcrypt");

const schema = new mongoose.Schema({
	username:{
		type: String,
		required: true,
		unique: true
	},
	password:{
		type: String,
		required: true,
		hide: true,
		bcrypt: true
	},
	tokens:{
		type: [
			{
				token:{type: String, required: true},
				deviceName: {type: String, required: true},
			}
		],
		default: []
	}
});

schema.plugin(mongooseBcrypt, {rounds: 10});

schema.pre("validate", function(next){
	if (!this.tokens)
		this.tokens = [];
	next();
});

module.exports = mongoose.model("User", schema);