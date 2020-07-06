const {compile} = require("nexe");

compile({
	input:"dist/index.js",
	name:"madmin",
	resources:[
		"dist/public/**/*"
	],
	output: "nexe/madmin",
	build:true,
	targets:[
		{
			platform: "linux",
			arch: "arm64",
			version: "12.14.0"
		}
	]
}).then(()=>{
	console.log("BUILDING DONE")
})