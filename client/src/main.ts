import Vue from 'vue'
import './plugins/vuetify'
import Root from "./Root.vue";
import router from './router'

Vue.config.productionTip = false

new Vue({
	router,
	render: h => h(Root)
}).$mount('#app')
