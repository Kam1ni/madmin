import { applicationConfig } from '@/app-config';

export class BaseRoutes{
	static readonly AUTH = applicationConfig.apiUrl+"/auth";
	static readonly USER = applicationConfig.apiUrl+"/user";
	static readonly APP = applicationConfig.apiUrl+"/app";
}