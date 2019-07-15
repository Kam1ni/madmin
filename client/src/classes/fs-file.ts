import { FsObject } from './fs-object';
export class FsFile extends FsObject {
	
	isDirectory(){
		return false;
	}
}