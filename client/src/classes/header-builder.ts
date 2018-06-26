import { authService } from '@/services/auth-service';

export class HeaderBuilder{
	headers:any = {};
	hasAuthorization:boolean = true;

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
			this.headers.Authorization = authService.token;
		}
		return this.headers;
	}
}