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

AppSchema.path("subdomain").validate(function(value){
	return !/\s/.test(value);
}, "Subdomain may not have spaces");

AppSchema.pre("validate", function(next){
	let obj = <IApp>this;
	obj.subdomain = obj.subdomain.toLowerCase();
	next();
});

export const App = model<IApp>("App", AppSchema);