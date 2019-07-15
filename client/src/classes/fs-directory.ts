import { FsObject } from './fs-object';
export class FsDirectory extends FsObject {
	
	isDirectory(){
		return true;
	}
}