import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/home/Home.vue';
import Apps from '@/components/apps/Apps.vue';
import Handlers from '@/components/handlers/Handlers.vue'
import AppEdit from '@/components/apps/Edit.vue';
import AppNew from '@/components/apps/New.vue';

Vue.use(Router)

const router = new Router({
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
		},
		{
			path:"/apps/new",
			component:AppNew
		},
		{
			path:"/apps/edit/:id",
			component:AppEdit
		},
		{
			path: '/handlers',
			name: "Handlers",
			component: Handlers
		}
	]
});

function setTitle(title:string){
	let element = document.querySelector<HTMLTitleElement>("head title");
	element.innerText = title == null ? "Madmin" : "Madmin - " + title;
}

router.beforeEach((to,from,next)=>{
	if (to.name){
		setTitle(to.name);
	}else{
		setTitle(null);
	}
	next();
});

export default router;