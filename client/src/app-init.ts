import Vue from 'vue'
import Root from "./Root.vue";
import router from './router'
import "./plugins/vuetify"

import VueCodemirror from "vue-codemirror";
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/base16-dark.css'
import 'codemirror/mode/javascript/javascript'
import '@/assets/css/vuetify-fixes.css'
import '@/assets/css/code-mirror.css'
import "material-design-icons-iconfont/dist/material-design-icons.css"

export function appInit(){
	Vue.config.productionTip = false

	Vue.use(VueCodemirror, {
		options:{
			tabSize:4,
			mode: 'text/javascript',
			theme: 'base16-dark',
			lineNumbers: true,
			line:true,
			indentWithTabs: true,
			indentUnit:4
		}
	})
	
	new Vue({
		router,
		render: h => h(Root)
	}).$mount('#app')
}