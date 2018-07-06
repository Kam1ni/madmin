<template>
	<v-layout row wrap align-center>
		<v-flex xs12 md6 xl4>
			<v-text-field label="Files path" :rules="pathRules" v-model="app.config.path"></v-text-field>
		</v-flex>
		<v-flex xs12 md6 xl8>
			<v-checkbox label="List files in directories" v-model="app.config.listFiles"></v-checkbox>
		</v-flex>
	</v-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import { isStringNullOrWhiteSpace, stringHasWhiteSpace } from '@/functions/string';
export default Vue.extend({
	data(){
		return {
			pathRules:[
				(v:string) => !isStringNullOrWhiteSpace(v) || "Path may not be empty",
				(v:string) => v == null || v[0] == "/" || "Path must be absolute and thus start with an \"/\""
			]
		}
	},
	props:[
		"app"
	]
});
</script>

