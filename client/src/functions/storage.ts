export function setLocalStorage(key:string, value:any){
	if (value == null){
		return localStorage.removeItem(key);
	}
	if (typeof(value) == "object"){
		return localStorage.setItem(key, JSON.stringify(value));
	}
	localStorage.setItem(key, value);
}

export function getLocalStorage(key:string, defaultValue:string = null):string{
	return localStorage.getItem(key) || defaultValue;
}