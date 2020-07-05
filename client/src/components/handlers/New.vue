<template>
	<v-container fluid fill-height>
		<v-layout column fill-height>
			<v-subheader>New Handler</v-subheader>
			<app-editor class="editor" :handler="handler"/>
		</v-layout>
	</v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import AppEditor from './Editor.vue'
import { Handler } from '@/classes/handler';

export default Vue.extend({
	data(){
		return {
			handler: new Handler()
		}
	},
	components:{
		AppEditor
	}
})
</script>

<style scoped>
.editor{
	flex-grow: 1;
}
</style>