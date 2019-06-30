<template>
	<v-container fluid grid-list-md>
		<v-layout row wrap justify-center>
			<v-flex xs12>
				<v-subheader>New Handler</v-subheader>
				<Editor :handler="handler"/>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import Editor from './Editor.vue'
import { Handler } from '@/classes/handler';

export default Vue.extend({
	data(){
		return {
			handler: new Handler()
		}
	},
	components:{
		Editor
	}
})
</script>
