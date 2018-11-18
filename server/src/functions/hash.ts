import * as md5 from "md5"

export async function hash(input:string, rounds:number):Promise<string>{
	return new Promise<string>((resolve)=>{
		for (let i = 0; i < rounds; i++){
			input = md5(input);
		}
		resolve(input)
	})
	
}

export async function hashCompare(input:string, hash:string, maxRounds:number = 50){
	return new Promise<boolean>((resolve)=>{
		for (let i = 0; i < maxRounds; i++){
			input = md5(input);
			if (input == hash){
				resolve(true);
			}
		}
		resolve(false)
	})
}