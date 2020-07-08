<template>
	<v-card class="card">
		<v-form v-model="valid" class="form">
			<v-card-text>
				<v-layout row>
					<v-flex xs12 md6>
						<v-text-field v-model="script.name" label="Name" :rules="nameRules"></v-text-field>
					</v-flex>
					<v-spacer/>
					<v-btn icon @click="showInfo = true"><v-icon color="accent">info</v-icon></v-btn>
				</v-layout>

				<v-layout row>
					<v-flex xs12>
						<v-switch v-model="script.runAtStartUp" label="Run on madmin start"/>
					</v-flex>
					<v-flex xs12>
						<v-switch v-model="script.runAtInterval" label="Run periodically"/>
					</v-flex>
				</v-layout>

				<v-layout wrap v-if="script.runAtInterval">
					<v-flex xs12 md6 xl3>
						<v-select :items="months" label="Month" v-model="script.month"/>
					</v-flex>
					<v-flex xs12 md6 xl3>
						<v-select :items="daysOfTheMonth" label="Day of the month" v-model="script.dayOfTheMonth"/>
					</v-flex>
					<v-flex xs12 md6 xl3>
						<v-select :items="daysOfTheWeek" label="Day of the week" v-model="script.dayOfTheWeek"/>
					</v-flex>
					<v-flex xs12 md6 xl3>
						<v-select :items="hours" label="Hour" v-model="script.hour"/>
					</v-flex>
					<v-flex xs12 md6 xl3 v-if="usesMinutesInterval">
						<v-select :items="minutes" label="Minut" v-model="script.minut"/>
					</v-flex>
				</v-layout>

				<v-layout row>
					<v-spacer/>
				</v-layout>
			</v-card-text>

			<codemirror v-model="script.code" class="editor"></codemirror>

			<v-card-actions>
				<v-spacer/>
				<v-btn depressed color="accent" @click="cancel">Cancel</v-btn>
				<v-btn depressed color="primary" @click="save">Save</v-btn>
			</v-card-actions>

			<v-dialog v-model="showInfo" max-width="900">
				<app-editor-info @close="showInfo = false"/>
			</v-dialog>
		</v-form>
	</v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { Script } from '@/classes/script';
import { isNullOrUndefined } from 'util';
import { stringHasWhiteSpace } from '@/functions/string';
import { scriptService } from '../../services/script-service';
import { AppConfig } from '../../conifg';
import AppEditorInfo from "./EditorInfo.vue";

interface ISelectItem {
	text:string;
	value:any;
}

export default Vue.extend({
	data(){
		return {
			valid:false,
			nameRules:[
				(v:string) => !isNullOrUndefined(v) || "Path may not be empty",
				(v:string) => !stringHasWhiteSpace(v) || "Path may not have spaces",
				(v:string) => !scriptService.scriptNameInUse(this.script.name, this.script.id) || "Path must be unique"
			],
			usesMinutesInterval: AppConfig.scriptsRunAtMinutIntervals,
			showInfo: false
		}
	},
	props:{
		script:{
			type:Object as ()=>Script,
			required:true
		}
	},
	computed:{
		daysOfTheWeek():ISelectItem[]{
			return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Any"].map((day, i)=>{
				return {
					text:day,
					value:i == 7 ? "*" : i
				}
			});
		},
		daysOfTheMonth():ISelectItem[]{
			let list = [{text:"Any", value:"*"}] as ISelectItem[];
			for (let i = 1; i <= 31; i++){
				list.push({
					text:i+"",
					value:i+""
				});
			}
			return list;
		},
		months():ISelectItem[]{
			return ["January" , "February" , "March",
				"April" , "May" , "June" , 
				"July" , "August" , "September" , 
				"October" , "November" , "December"].map((val, i)=>{
					return {
						text:val,
						value:i+""
					}
			}).concat([{text:"Any", value:"*"}]);
		},
		hours():ISelectItem[]{
			let list = [{text:"Any", value:"*"}] as ISelectItem[];
			for (let i = 0; i <= 23; i++){
				list.push({
					text:i+"",
					value:i+""
				});
			}
			return list;
		},
		minutes():ISelectItem[]{
			let list = [{text:"Any", value:"*"}] as ISelectItem[];
			for (let i = 0; i <= 59; i++){
				list.push({
					text:i+"",
					value:i+""
				});
			}
			return list;
		}
	},
	methods:{
		cancel(){
			this.$router.go(-1);
		},
		async save(){
			await this.script.save();
			this.$router.go(-1);
		},
		createValidityArray(start:number, end:number):string[]{
			let arr = ["*"] as string[];
			for (let i = start; i <= end; i++){
				arr.push(`${i}`);
			}
			return arr;
		}
	},
	components:{
		AppEditorInfo
	}
})
</script>


<style scoped>
.editor{
	flex-grow: 1;
	flex-shrink: 1;
}

.card, .form{
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	flex-shrink: 1;
}
</style>