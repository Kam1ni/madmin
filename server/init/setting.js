const Setting = require("../models/setting");

async function checkIfSettingExists(setting){
	setting = await Setting.findByName(setting.name);
	return setting != null;
}

async function createSetting(setting){
	setting = new Setting(setting);
	await setting.save();
}

async function createSettings(settings){
	for (let setting of settings){
		if (!await checkIfSettingExists(setting)){
			await createSetting(setting);
		}
	}
}

module.exports = async function(){
	await createSettings(
		[{name:"defaultSubDomain", value:"www"}]
	);
}