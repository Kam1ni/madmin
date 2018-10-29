const {spawnSync, execSync} = require("child_process");

function spawn(command){
	execSync(command, {stdio:[process.stdin, process.stdout, process.stderr]});
}

spawn("npm run copy-assets");
spawn("npm run start")