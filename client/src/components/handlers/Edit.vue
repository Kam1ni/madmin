<template>
	<v-container grid-list-md fill-height>
		<v-layout align-center justify-center v-if="handler == null">
			<v-progress-circular color="accent" :indeterminate="true"></v-progress-circular>
		</v-layout>
		<v-layout row wrap justify-center v-else>
			<v-flex xs12>
				<v-subheader>Edit Handler</v-subheader>
				<Editor :handler="handler"/>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Handler } from '@/classes/handler';
import Editor from './Editor.vue';
import { handlerService } from '@/services/handler-service';

export default Vue.extend({
	data(){
		return {
			handler:<Handler|null> null
		}
	},
	components:{
		Editor
	},
	async mounted(){
		this.handler = await handlerService.getHandler(this.$route.params.id);
	}
})
</script>
