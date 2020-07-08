<template>
	<v-card class="card">
		<v-form class="form" v-model="valid">
			<v-card-text>
				<v-layout row wrap align-center>
					<v-flex xs12 md6 xl8>
						{{fullUrl}}
					</v-flex>
					<v-spacer/>
					<v-btn icon @click="showInfo = true"><v-icon color="accent">info</v-icon></v-btn>
				</v-layout>
				<v-layout row>
					<v-flex xs12 sm6>
						<v-select
						:items="allowedMethods"
						label="Methods"
						v-model="handler.methods"
						multiple
						></v-select>
					</v-flex>
					<v-flex xs12 md6>
						<v-text-field v-model="handler.path" label="Path" :rules="pathRules"></v-text-field>
					</v-flex>
				</v-layout>
			</v-card-text>
			<codemirror v-model="handler.code" class="editor"></codemirror>
			<v-card-actions>
				<v-spacer/>
				<v-btn depressed color="accent" to="/handlers">Back to handlers</v-btn>
				<v-btn depressed color="primary" @click="save">Save</v-btn>
			</v-card-actions>
			<v-dialog max-width="900" v-model="showInfo">
				<app-editor-info @close="showInfo = false"/>
			</v-dialog>
		</v-form>
	</v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { isNullOrUndefined } from 'util';
import { stringHasWhiteSpace } from '@/functions/string';
import { handlerService } from '@/services/handler-service';
import { Handler } from '@/classes/handler';
import { BaseRoutes } from '@/classes/api';
import AppEditorInfo from "./EditorInfo.vue";
import { constants } from 'fs';
const {codemirror} = require('vue-codemirror')

export default Vue.extend({
	data(){
		return {
			valid:false,
			apiUrl:BaseRoutes.HANDLER_EXEC,
			pathRules:[
				(v:string) => !isNullOrUndefined(v) || "Path may not be empty",
				(v:string) => !stringHasWhiteSpace(v) || "Path may not have spaces",
				(v:string) => !handlerService.isPathInUse(this.handler.path, this.handler.id) || "Path must be unique"
			],
			allowedMethods:Handler.ALLOWED_METHODS,
			showInfo:false
		}
	},
	props:{
		handler:{
			type:Object as ()=>Handler,
			required:true
		}
	},
	computed:{
		fullUrl():string{
			if (!this.handler.path){
				return this.apiUrl+"/...";
			}
			if (!this.handler.path.match(/^\//)){
				return this.apiUrl + "/" + this.handler.path
			}
			return this.apiUrl + this.handler.path;
		}
	},
	methods:{
		async save(){
			await this.handler.save();
		},
		onKeyPress(event:KeyboardEvent){
			if (!event.ctrlKey) return;
			if (event.shiftKey) return;
			if (event.altKey) return;
			if (event.key.toLowerCase() != "s") return;
			event.preventDefault();
			this.save();
			return false;
		}
	},
	components:{
		codemirror,
		AppEditorInfo
	},
	created(){
		window.addEventListener("keydown", this.onKeyPress);
	},
	destroyed(){
		window.removeEventListener("keydown", this.onKeyPress)
	}
})
</script>

<style scoped>

.card, .form{
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	flex-shrink: 1;
}

.editor {
	flex-grow:1;
	flex-shrink: 1;
}
</style>
