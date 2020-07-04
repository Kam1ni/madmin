export function getBrowserName():string{
	if (window.navigator.vendor == "Google Inc."){
		return "Google Chrome";
	}
	if (window.navigator.userAgent.indexOf("Firefox") != -1){
		return "Firefox";
	}
	return window.navigator.appName;
}

export function getClientOS():string{
	if (window.navigator.platform.indexOf("Windows") != -1){
		return "Windows";
	}
	if (window.navigator.platform.indexOf("Linux") != -1){
		return "Linux"
	}
	if (window.navigator.platform.indexOf("Mac") != -1){
		return "Mac"
	}
	return window.navigator.platform;
}