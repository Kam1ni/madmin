<template>
	<v-app :dark="darkModeEnabled">
		<v-navigation-drawer persistent v-model="drawer" enable-resize-watcher fixed app>
			<v-list>
				<v-list-tile v-for="(item, i) in items" :key="i" :to="{name: item.title}" :exact="item.title == 'Home'">
					<v-list-tile-action>
						<v-icon v-html="item.icon"></v-icon>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title v-text="item.title"></v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>
				<v-divider/>
				<v-list-tile>
					<v-list-tile-action>
						<v-icon>nights_stay</v-icon>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title>Dark mode</v-list-tile-title>
					</v-list-tile-content>
					<v-list-tile-action>
						<v-switch v-model="darkModeEnabled"></v-switch>
					</v-list-tile-action>
				</v-list-tile>
			</v-list>
		</v-navigation-drawer>
		<v-toolbar color="primary" text-color="white" app>
			<v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
	        <img src="@/assets/logo.png" alt="Vuetify.js" class="icon">
			<v-toolbar-title v-text="title"></v-toolbar-title>
			<v-spacer></v-spacer>
		</v-toolbar>
		<v-content>
			<router-view></router-view>
		</v-content>
	</v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { authService } from '@/services/auth-service';

export default Vue.extend({
	data(){
		return {
			title: 'Madmin',
			drawer: true,
			darkModeEnabled:false
		}
	},
	watch:{
		darkModeEnabled(){
			localStorage.setItem("dark-mode-enabled", this.darkModeEnabled ? "true" : "false");
		}
	},
	computed:{
		items():any[]{
		 	let res = [
				{
					icon: 'home',
					title: 'Home'
				},
				{
					icon: 'language',
					title: 'Apps'
				},
				{
					icon: 'device_hub',
					title: 'Handlers'
				},
				{
					icon: 'memory',
					title: 'Scripts'
				},
				{
					icon: 'settings',
					title: 'Settings'
				}
			];
			if (authService.user.isAdmin){
				res.push({
					title:"File System",
					icon:"folder_open"
				})
			}
			return res;
		}
	},
	created(){
		this.darkModeEnabled = localStorage.getItem("dark-mode-enabled") == "true"
	}
});
</script>

<style scoped>
.icon {
	max-height: 80%;
}
</style>
