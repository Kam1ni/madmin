import Vue from 'vue';
import { BaseRoutes } from '../classes/api';
import { FsFile } from '../classes/fs-file';
import { FsDirectory } from '../classes/fs-directory';
import Axios from 'axios';
import { HeaderBuilder } from '../classes/header-builder';

const API_URL:string = BaseRoutes.FS;

export type FSResponseTypes = "directory"|"text"|"image";

export interface IFSDirectoryResponse {
	files:FsFile[];
	directories:FsDirectory[];
}

export interface IFSRespone {
	content:any|IFSDirectoryResponse;
	type:FSResponseTypes;
	mimeType?:string;
}

export const fsService = new Vue({
	methods:{
		async openContent(path:string):Promise<IFSRespone>{
			let result = await Axios.get(`${API_URL}${path}`, {headers:HeaderBuilder.getDefaultHeaders(), responseType:"blob"});
			let fileReader = new FileReader();
			fileReader.readAsText(result.data);
			await new Promise((resolve, reject)=>{
				fileReader.addEventListener('loadend', resolve);
				fileReader.addEventListener("onerror", reject)
			});
			let textContent = fileReader.result as string;
			if (result.status == 210){
				if (/image/.exec(result.headers["content-type"])){
					return {
						type:"image",
						content:result.data,
						mimeType:result.headers["content-type"]
					};
				}
				return {
					type:"text",
					content:textContent
				};
			}
			let obj = JSON.parse(textContent);
			let files = obj.files.map((f:any)=>new FsFile(f));
			let directories = obj.directories.map((d:any)=>new FsDirectory(d));

			return {
				type:"directory",
				content:{files,directories}
			}
		}
	}
});