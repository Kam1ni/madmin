<template>
	<v-container fluid fill-height>
		<v-layout align-center justify-center v-if="script == null">
			<v-progress-circular color="accent" :indeterminate="true"></v-progress-circular>
		</v-layout>
		<v-layout column fill-height v-else>
			<v-subheader>Edit Script</v-subheader>
			<app-editor class="editor" :script="script" :style="{flexGrow:1}"/>
		</v-layout>
	</v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Script } from '@/classes/script';
import AppEditor from "./Editor.vue"
import { scriptService } from '@/services/script-service';
export default Vue.extend({
	data(){
		return {
			script:null as Script
		}
	},
	async mounted(){
		this.script = await scriptService.getScript(this.$route.params.id);
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