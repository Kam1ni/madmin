<template>
	<v-app>
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
				<v-list-tile @click="logout()">
					<v-list-tile-content>
						<v-list-tile-title v-text="'logout'"></v-list-tile-title>
					</v-list-tile-content>
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

<style scoped>
.icon {
	max-height: 80%;
}
</style>
