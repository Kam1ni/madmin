<template>
	<v-container fluid fill-height>
		<v-layout column>
			<v-subheader>New Script</v-subheader>
			<app-editor class="editor" :script="script"/>
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

<style scoped>
.editor{
	flex-grow: 1;
}
</style>