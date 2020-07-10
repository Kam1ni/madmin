const {compile} = require("nexe");

compile({
	input: "dist/index.js",
	name: "madmin",
	resources: [
		"dist/public/**/*"
	],
	output: "nexe/madmin",
	build: true,
	targets: [
		{
			version: "12.14.0"
		}
	]
}).then(()=>{
	console.log("BUILDING DONE");
});