import { AppConfig } from '@/conifg';

export class BaseRoutes {
	static get USER():string {
		return `${AppConfig.apiUrl}/user`
	}

	static get HANDLER():string{
		return `${AppConfig.apiUrl}/handler`
	}

	static get HANDLER_EXEC():string{
		return `${AppConfig.apiUrl}/exec-handler`
	}

	static get AUTH():string{
		return `${AppConfig.apiUrl}/auth`
	}

	static get CONFIG():string{
		return `${AppConfig.apiUrl}/config`
	}

	static get APP():string{
		return `${AppConfig.apiUrl}/app`
	}

	static get SCRIPT():string{
		return `${AppConfig.apiUrl}/script`
	}

	static get FS():string{
		return `${AppConfig.apiUrl}/fs`
	}
}
