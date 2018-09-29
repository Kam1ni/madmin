<template>
	<v-card>
		<v-form v-model="valid">
			<v-card-text>
				<v-layout row wrap align-center>
					<v-flex xs12 md6 xl8>
						{{apiUrl}}{{handler.path}}
					</v-flex>
					<v-flex xs12 md6 xl4>
						<v-text-field v-model="handler.path" label="Path" :rules="pathRules"></v-text-field>
					</v-flex>
				</v-layout>
			</v-card-text>
			async function(req, res, require){
			<!--<v-textarea v-model="handler.code" label="code" box auto-grow></v-textarea>-->
			<codemirror v-model="handler.code"></codemirror>
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
import { applicationConfig } from '@/app-config';
import { isNullOrUndefined } from 'util';
import { stringHasWhiteSpace } from '@/functions/string';
import { handlerService } from '@/services/handler-service';
const {codemirror} = require('vue-codemirror')

export default Vue.extend({
	data(){
		return {
			valid:false,
			apiUrl:applicationConfig.apiUrl + "/exec-handler/",
			pathRules:[
				(v:string) => !isNullOrUndefined(v) || "Path may not be empty",
				(v:string) => !stringHasWhiteSpace(v) || "Path may not have spaces",
				(v:string) => !handlerService.isPathInUse(this.handler.path, this.handler.id) || "Path must be unique"
			],
			
		}
	},
	methods:{
		cancel(){
			this.$router.go(-1);
		},
		async save(){
			await this.handler.save();
			this.$router.go(-1);
		}
	},
	props:["handler"],
	components:{
		codemirror
	}
})
</script>

