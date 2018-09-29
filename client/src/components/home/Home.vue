<template>
	<v-container>
		<v-layout align-center column v-if="this.apps.length == 0">
			<img src="@/assets/logo.png" alt="Vuetify.js" class="mb-5">
		</v-layout>
		<v-layout v-else>
			<v-flex xs12 sm6 md4>
				<v-card v-for="(app,i) in apps" :key="i">
					<v-card-title>{{app.subdomain}}</v-card-title>
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
	async mounted(){
		this.apps = await appService.getApps();
	}
});
</script>
