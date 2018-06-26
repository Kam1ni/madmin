import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/home/Home.vue';
import Apps from '@/components/apps/Apps.vue';
import Handlers from '@/components/handlers/Handlers.vue'

Vue.use(Router)

export default new Router({
	routes: [
		{
			path: '/',
			name: 'Home',
			component: Home,
		},
		{
			path: '/apps',
			name: 'Apps',
			component: Apps,
			children:[
				{
					path:"/new",
				},
				{
					path:"edit/:id"
				}
			]
		},
		{
			path: '/handlers',
			name: "Handlers",
			component: Handlers
		}
	]
})
