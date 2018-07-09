import { configService } from '@/services/config-service';

export class AppSettings{
	defaultRedirect:string;
	version:string;

	constructor(data:any){
		this.defaultRedirect = data.defaultRedirect;
		this.version = data.version;
	}

	static async updateDefaultRedirect(newRedirect:string){
		return await configService.updateSetting("defaultRedirect", newRedirect);
	}
}