<template>
	<v-container fluid grid-list-md>
		<v-layout row wrap justify-center>
			<v-flex xs12>
				<v-subheader>New Script</v-subheader>
				<app-editor :script="script"/>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Script } from '@/classes/script';
import AppEditor from './Editor.vue'
export default Vue.extend({
	data(){
		return {
			script:new Script()
		}
	},
	components:{
		AppEditor
	}
})
</script>
