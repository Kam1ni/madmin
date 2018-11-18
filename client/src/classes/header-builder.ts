export class HeaderBuilder{
	headers:any = {};
	hasAuthorization:boolean = true;
	private get token():string{
		return localStorage.getItem("auth_token");
	}

	static getDefaultHeaders():any{
		return new HeaderBuilder().build();
	}

	setHeader(name:string, value:any):HeaderBuilder{
		this.headers[name] = value;
		return this;
	}

	removeHeader(name:string):HeaderBuilder{
		this.headers[name] = undefined;
		return this;
	}

	setAuthorization(hasAuthorization:boolean):HeaderBuilder{
		this.hasAuthorization = hasAuthorization;
		return this;
	}

	build():any{
		if (this.hasAuthorization){
			this.headers.Authorization = this.token;
		}
		return this.headers;
	}
}