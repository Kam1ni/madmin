<template>
	<v-container fluid grid-list-md>
		<v-layout row wrap justify-center>
			<v-flex xs12 md10 lg6>
				<v-subheader>New App</v-subheader>
				<Editor @submit="onSave($event)" :app="app"></Editor>	
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import Editor from './Editor.vue'
import {App} from '@/classes/app';

export default Vue.extend({
	components:{
		Editor
	},
	data(){
		let app = new App();
		app.config = {url:""};
		return {
			app
		}
	},
	methods:{
		async onSave($event:App){
			console.log("Save");
			await $event.save();
			this.$router.go(-1);
		}
	}
})
</script>

