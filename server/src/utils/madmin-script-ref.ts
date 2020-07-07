import { AppQuery } from '../models/app';
import { HandlerQuery } from '../models/handler';
import { ScriptQuery } from '../models/script';

class MadminScriptRef {
	vars:any = {};
	readonly appQuery = AppQuery;
	readonly handlerQuery = HandlerQuery;
	readonly scriptQuery = ScriptQuery;
}

export const madminScriptRefInstance = new MadminScriptRef();