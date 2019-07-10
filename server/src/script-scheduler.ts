import { getConfig } from './config';
import { ScriptQuery } from './models/script';
import { madminScriptRefInstance } from './classes/madmin-script-ref';

function getNextIntervalTime():number{
	let config = getConfig();
	let date = new Date();
	let targetDate = new Date();
	targetDate.setSeconds(1);
	targetDate.setMilliseconds(0);
	if (config.runScriptsAtMinutIntervals){
		targetDate.setMinutes(date.getMinutes()+1);
	}else{
		targetDate.setHours(date.getHours()+1);
	}
	return targetDate.getTime() - date.getTime();
}

function scriptValueOkForIntervalRun(scriptValue:string, dateValue:number):boolean{
	if (scriptValue == "*" || scriptValue == null){
		return true;
	}
	if (parseInt(scriptValue) == dateValue){
		return true;
	}
	return false;
}

function runTick(){
	let config = getConfig();
	let interval = getNextIntervalTime();
	setTimeout(async ()=>{
		let date = new Date();
		let scripts = await ScriptQuery.find({runAtInterval:true});
		let dayOfTheWeek = date.getDay();
		let dayOfTheMonth = date.getDate();
		let month = date.getMonth();
		let hour = date.getHours();
		let minut = date.getMinutes();

		for (let script of scripts){
			if (!scriptValueOkForIntervalRun(script.dayOfTheMonth, dayOfTheMonth)){
				continue;
			}
			if (!scriptValueOkForIntervalRun(script.dayOfTheWeek, dayOfTheWeek)){
				continue;
			}
			if (!scriptValueOkForIntervalRun(script.month, month)){
				continue;
			}
			if (!scriptValueOkForIntervalRun(script.hour, hour)){
				continue;
			}
			if (config.runScriptsAtMinutIntervals){
				if (!scriptValueOkForIntervalRun(script.minut, minut)){
					continue;
				}
			}
			script.execute(madminScriptRefInstance, []).catch(e=>{
				console.error(`${script.name} crashed`);
				console.error(e);
			});
		}

		runTick();
	}, interval)
}

export async function startScriptScheduler(){
	let scripts = await ScriptQuery.find({runAtStartUp:true});
	
	for (let script of scripts){
		script.execute(madminScriptRefInstance, []).catch(e=>{
			console.error(`${script.name} crashed`);
			console.error(e);
		});
	}
	
	runTick();
}