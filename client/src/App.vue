<template>
	<v-app>
		<v-navigation-drawer
			persistent
			v-model="drawer"
			enable-resize-watcher
			fixed
			app>
			<v-list>
				<v-list-tile
					value="true"
					v-for="(item, i) in items"
					:key="i">
					<v-list-tile-action>
						<v-icon v-html="item.icon"></v-icon>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title v-text="item.title"></v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>
				<v-list-tile @click="logout()">
					<v-list-tile-content>
						<v-list-tile-title v-text="'logout'"></v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>
			</v-list>
		</v-navigation-drawer>
		<v-toolbar
			app
			:clipped-left="clipped">
			<v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
			<v-toolbar-title v-text="title"></v-toolbar-title>
			<v-spacer></v-spacer>
		</v-toolbar>
		<v-content>
			<HelloWorld/>
		</v-content>
		<v-navigation-drawer
			temporary
			:right="right"
			v-model="rightDrawer"
			fixed
			app
		>
			<v-list>
				<v-list-tile @click="right = !right">
					<v-list-tile-action>
						<v-icon>compare_arrows</v-icon>
					</v-list-tile-action>
					<v-list-tile-title>Switch drawer (click me)</v-list-tile-title>
				</v-list-tile>
			</v-list>
		</v-navigation-drawer>
		<v-footer :fixed="fixed" app>
			<span>&copy; 2017</span>
		</v-footer>
	</v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import HelloWorld from "./components/HelloWorld.vue";
import { authService } from '@/services/auth-service';

export default Vue.extend({
	data(){
		return {
			drawer: true,
			items: [
				{
					icon: 'home',
					title: 'Home'
				},
				{
					icon: 'language',
					title: 'Apps'
				},
				{
					icon: 'memory',
					title: 'Handlers'
				}
			],
			title: 'Madmin'
		}
	},
	components:{
		HelloWorld
	},
	methods:{
		async logout(){
			await authService.logout();
		}
	}
});
</script>
