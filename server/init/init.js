const config = require("./config");
const db = require("./db");
const setting = require("./setting");

module.exports = async function(){
	config();
	await db();
	await setting();
}