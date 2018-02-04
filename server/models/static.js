const mongoose = require("mongoose");
const eventsPlugin = require("mongoose-events");

const schema = new mongoose.Schema({
	subdomain: {
		type: String,
		required: true
	},
	path: {
		type: String,
		required: true
	}
});

schema.plugin(eventsPlugin.mongooseEventsSerialPlugin);

module.exports = mongoose.model("Static", schema);