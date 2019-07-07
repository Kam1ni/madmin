import { AppConfig } from '@/conifg';

export class BaseRoutes {
	static get USER():string {
		return `${AppConfig.baseUrl}/user`
	}

	static get HANDLER():string{
		return `${AppConfig.baseUrl}/handler`
	}

	static get HANDLER_EXEC():string{
		return `${AppConfig.baseUrl}/exec-handler`
	}

	static get AUTH():string{
		return `${AppConfig.baseUrl}/auth`
	}

	static get CONFIG():string{
		return `${AppConfig.baseUrl}/config`
	}

	static get APP():string{
		return `${AppConfig.baseUrl}/app`
	}

	static get SCRIPT():string{
		return `${AppConfig.baseUrl}/script`
	}
}