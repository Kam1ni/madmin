<template>
	<v-container fluid grid-list-md>
		<v-layout align-center justify-center v-if="app == null">
			<v-progress-circular color="accent" :indeterminate="true"></v-progress-circular>
		</v-layout>
		<v-layout row wrap justify-center v-else>
			<v-flex xs12 md10 lg6>
				<v-subheader>Edit App</v-subheader>
				<Editor @submit="onSave($event)" :app="app"></Editor>	
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { App } from '@/classes/app';
import { appService } from '@/services/app-service';
import Editor from './Editor.vue';

export default Vue.extend({
	data(){
		return {
			app:<App|null>null			
		}
	},
	async mounted(){
		this.app = await appService.getApp(this.$route.params.id);
	},
	methods:{
		async onSave(app:App){
			await app.save();
			return this.$router.go(-1);
		}
	},
	components:{
		Editor
	}
})
</script>

