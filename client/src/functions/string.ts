export function isStringNullOrEmpty(text:string):boolean{
	if (text == null) return true;
	if (text == "") return true;
	return false;
}

export function isStringNullOrWhiteSpace(text:string):boolean{
	if (isStringNullOrEmpty(text)) return true;
	if (text.match(/^\s+$/)) return true;
	return false;
}

export function stringHasWhiteSpace(text:string):boolean{
	if (isStringNullOrEmpty(text)) return false;
	if (text.match(/\s/)) return true;
	return false;
}