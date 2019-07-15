import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/home/Home.vue';
import Apps from '@/components/apps/Apps.vue';
import AppEdit from '@/components/apps/Edit.vue';
import AppNew from '@/components/apps/New.vue';
import Handlers from '@/components/handlers/Handlers.vue';
import HandlerNew from '@/components/handlers/New.vue';
import HandlerEdit from '@/components/handlers/Edit.vue';
import Settings from '@/components/settings/Settings.vue';
import SettingsList from '@/components/settings/List.vue';
import SettingsTokens from '@/components/settings/Tokens.vue';
import UserEdit from '@/components/settings/UserEdit.vue';
import Scripts from "@/components/scripts/Scripts.vue";
import ScriptEdit from "@/components/scripts/Edit.vue";
import ScriptNew from "@/components/scripts/New.vue";
import FsRoot from "@/components/fs/Root.vue";

Vue.use(Router)

const router = new Router({
	mode:"history",
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
		},
		{
			path: '/handlers/new',
			component: HandlerNew
		},
		{
			path: '/handlers/edit/:id',
			component: HandlerEdit
		},
		{
			path: '/scripts',
			name: "Scripts",
			component: Scripts
		},
		{
			path: '/scripts/new',
			component:ScriptNew
		},
		{
			path: '/scripts/edit/:id',
			component:ScriptEdit
		},
		{
			path: '/fs/:path(.*)',
			component:FsRoot,
		},
		{
			path: '/fs',
			component:FsRoot,
			name:"File System"
		},
		{
			path: '/settings',
			component: Settings,
			children:[
				{path:'', component:SettingsList, name: "Settings"},
				{path:'tokens', component:SettingsTokens },
				{path:'user/edit/:id', component:UserEdit},
				{path:'user/new', component:UserEdit}
			]
		}
	]
});

function setTitle(title:string){
	let element = document.querySelector<HTMLTitleElement>("head title");
	element.innerText = title == null ? "Madmin" : "Madmin - " + title;
}

router.beforeEach((to,from,next)=>{
	setTitle(to.name || null);
	next();
});

export default router;