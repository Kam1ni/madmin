import Vue from 'vue'
import './plugins/vuetify'
import 'vuetify/dist/vuetify.css'
import Root from "./Root.vue";
import router from './router'
const VueCodemirror = require("vue-codemirror");
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/base16-dark.css'
import 'codemirror/mode/javascript/javascript'

Vue.config.productionTip = false

Vue.use(VueCodemirror, {
	options:{
		tabSize:4,
		mode: 'text/javascript',
		theme: 'base16-dark',
		lineNumbers: true,
		line:true
	}
})

new Vue({
	router,
	render: h => h(Root)
}).$mount('#app')
