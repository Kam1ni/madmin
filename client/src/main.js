import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify';
import VueResource from 'vue-resource';
import AuthService from './services/auth-service';
import AppError from './components/common/Error.vue';
import ConfirmDialog from './components/common/ConfirmDialog.vue';

Vue.use(VueResource);
if (process.env.NODE_ENV == "development"){
	Vue.http.options.root = "http://madmin.localhost.kami-dev.eu:3000";
	console.log(Vue.http.options.root);
}else{
	Vue.http.options.root = "/";
}
Vue.http.interceptors.push(function(req,next){
	if (localStorage.getItem("token")){
		req.headers.set('Authorization', localStorage.getItem("token"));
	}
	next((res)=>{
		console.log(res);
		if (res.status == 401){
			Vue.AuthService.tokenIsInvalid();
		}
	});
});

Vue.use(AuthService);

Vue.config.productionTip = false
Vue.use(Vuetify, {
	theme: {
		primary: "#1976D2",
		secondary: "#1565C0",
		accent: "#039BE5",
		error: "#f44336",
	}
});

Vue.component('app-error', AppError);
Vue.component("app-confirm-dialog",ConfirmDialog );

new Vue({
	el: '#app',
	router,
	components: { App },
	template: '<App/>',
});
