import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/Home.vue'
import Proxies from '../components/Proxies.vue';
import Webhooks from '../components/Webhooks.vue';
import Profile from '../components/Profile.vue';

Vue.use(Router)

export default new Router({
	mode: "history",
	routes: [
		{
			path: '/',
			component: Home
		},
		{
			path: "/proxies",
			component: Proxies
		},
		{
			path: "/webhooks",
			component: Webhooks
		},
		{
			path: "/profile",
			component: Profile
		}
	]
})
