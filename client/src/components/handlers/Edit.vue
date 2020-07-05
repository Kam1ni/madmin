<template>
	<v-container fluid fill-height>
		<v-layout align-center justify-center v-if="handler == null">
			<v-progress-circular color="accent" :indeterminate="true"></v-progress-circular>
		</v-layout>
		<v-layout column fill-height v-else>
			<v-subheader>Edit Handler</v-subheader>
			<app-editor class="editor" :handler="handler"/>
		</v-layout>
	</v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Handler } from '@/classes/handler';
import AppEditor from './Editor.vue';
import { handlerService } from '@/services/handler-service';

export default Vue.extend({
	data(){
		return {
			handler:<Handler|null> null
		}
	},
	components:{
		AppEditor
	},
	async mounted(){
		this.handler = await handlerService.getHandler(this.$route.params.id);
	}
})
</script>

<style scoped>
.editor{
	flex-grow: 1;
}
</style>