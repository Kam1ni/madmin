import {Schema, Document, model} from "mongoose";

export interface IProxyApp {
	url:string;
}

export interface IStaticApp {
	path:string;
	listFiles:boolean;
}

export interface IApp extends Document {
	subdomain:string;
	enabled:boolean;
	type:"static"|"proxy";
	config:IStaticApp|IProxyApp
}

const AppSchema = new Schema({
	subdomain:{type:String, required:true, unique:true},
	type:{type:String, enum:["static", "proxy"], required:true},
	config:{type:Schema.Types.Mixed, required:true}
});

export const App = model<IApp>("App", AppSchema);