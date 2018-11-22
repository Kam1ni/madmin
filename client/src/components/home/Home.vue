<template>
	<v-container>
		<v-layout align-center column v-if="this.apps.length == 0">
			<img src="@/assets/logo.png" alt="Vuetify.js" class="mb-5">
		</v-layout>
		<v-layout v-else>
			<v-flex xs12 sm6 md4 v-for="(app,i) in apps" :key="i" wrap>
				<v-card>
					<v-card-title>{{app.subdomain}}</v-card-title>
					<v-card-text>
						{{app.fullUrl}}
					</v-card-text>
					<v-card-actions>
						<v-spacer/>
						<v-btn flat @click="goTo(app)">OPEN</v-btn>
					</v-card-actions>
				</v-card>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { appService } from '@/services/app-service';
import { App } from '@/classes/app';
export default Vue.extend({
	data(){
		return{
			apps:<App[]>[]
		}
	},
	methods:{
		goTo(app:App){
			window.open(app.fullUrl);
		}
	},
	async mounted(){
		this.apps = await appService.getApps();
	}
});
</script>
