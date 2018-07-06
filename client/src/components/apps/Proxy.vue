<template>
	<v-layout row wrap>
		<v-flex xs12 md6 xl4>
			<v-text-field v-model="app.config.url" label="Server URL" :rules="urlRules"></v-text-field>
		</v-flex>
	</v-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import { isStringNullOrWhiteSpace, stringHasWhiteSpace } from '@/functions/string';

export default Vue.extend({
	data(){
		return {
			urlRules:[
				(v:string) => !isStringNullOrWhiteSpace(v) || "Url may not be empty",
				(v:string) => !stringHasWhiteSpace(v) || "Url may not contain spaces"
			]
		}
	},
	props:["app"]
})
</script>

