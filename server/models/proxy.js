const mongoose = require("mongoose");
const eventsPlugin = require("mongoose-events");

const schema = new mongoose.Schema({
	endpoint: {
		type:String,
		required: true
	},
	subdomain: {
		type:String,
		required: true,
		unique: true
	}
});


schema.plugin(eventsPlugin.mongooseEventsSerialPlugin);

module.exports = mongoose.model("Proxy", schema);