import Vue from 'vue';
import { BaseRoutes } from '../classes/api';
import { FsFile } from '../classes/fs-file';
import { FsDirectory } from '../classes/fs-directory';
import Axios from 'axios';
import { HeaderBuilder } from '../classes/header-builder';

const API_URL:string = BaseRoutes.FS;

export const fsService = new Vue({
	methods:{
		async openContent(path:string):Promise<string|{files:FsFile[], directories:FsDirectory[]}>{
			let result = await Axios.get(`${API_URL}${path}`, {headers:HeaderBuilder.getDefaultHeaders()});
			if (typeof(result.data) == "string"){
				return result.data;
			}
			let files = result.data.files.map((f:any)=>new FsFile(f));
			let directories = result.data.directories.map((d:any)=>new FsDirectory(d));
			return {files, directories};
		}
	}
});