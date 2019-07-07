<template>
	<v-card>
		<v-form v-model="valid">
			<v-card-text>
				<v-flex xs12 md6>
					<v-text-field v-model="script.name" label="Name" :rules="nameRules"></v-text-field>
				</v-flex>
			</v-card-text>
			async function(require, ...args){
			<codemirror v-model="script.code"></codemirror>
			}
			<v-card-actions>
				<v-spacer/>
				<v-btn depressed color="accent" @click="cancel">Cancel</v-btn>
				<v-btn depressed color="primary" @click="save">Save</v-btn>
			</v-card-actions>
		</v-form>
	</v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { Script } from '@/classes/script';
import { isNullOrUndefined } from 'util';
import { stringHasWhiteSpace } from '@/functions/string';
import { scriptService } from '../../services/script-service';
export default Vue.extend({
	data(){
		return {
			valid:false,
			nameRules:[
				(v:string) => !isNullOrUndefined(v) || "Path may not be empty",
				(v:string) => !stringHasWhiteSpace(v) || "Path may not have spaces",
				(v:string) => !scriptService.scriptNameInUse(this.script.name, this.script.id) || "Path must be unique"
			],
		}
	},
	props:{
		script:{
			type:Object as ()=>Script,
			required:true
		}
	},
	methods:{
		cancel(){
			this.$router.go(-1);
		},
		async save(){
			await this.script.save();
			this.$router.go(-1);
		}
	},
})
</script>
