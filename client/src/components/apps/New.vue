<template>
	<v-container fluid grid-list-md>
		<v-layout row wrap justify-center>
			<v-flex xs12 md10 lg6>
				<v-subheader>New App</v-subheader>
				<Editor save-button="Create" @save-clicked="onSave" :app="app"></Editor>	
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
		return {
			app:new App()
		}
	},
	methods:{
		onSave($event:App){
			
		}
	}
})
</script>

