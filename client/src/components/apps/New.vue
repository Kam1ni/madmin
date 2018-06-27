<template>
	<v-container fluid>
		<h4>New App</h4>
		<Editor save-button="Create" @save-clicked="onSave"></Editor>	
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
	methods:{
		onSave($event:App){
			
		}
	}
})
</script>

