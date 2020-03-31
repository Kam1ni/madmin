<template>
	<v-container fluid grid-list-md fill-height>
		<v-layout align-center justify-center v-if="items == null">
			<v-progress-circular color="accent" :indeterminate="true"></v-progress-circular>
		</v-layout>
		<v-layout align-center justify-center v-else-if="items.length == 0">
			<v-subheader>No scripts available</v-subheader> 
		</v-layout>
		<v-layout v-else row wrap justify-center>
			<v-flex xs12 md10 lg6>
				<v-subheader>Scripts</v-subheader>
				<v-card>
					<v-list>
						<v-list-tile v-for="item in items" :key="item.id">
							<v-list-tile-content>
								<v-list-tile-title v-html="item.name"></v-list-tile-title>
							</v-list-tile-content>

							<v-list-tile-action>
								<v-btn icon @click="executeClicked(item)">
									<v-icon>flash_on</v-icon> 
								</v-btn>
							</v-list-tile-action>

							<v-list-tile-action>
								<v-menu left>
									<v-btn icon slot="activator"><v-icon>more_vert</v-icon></v-btn>
									<v-list>
										<v-list-tile :to="'/scripts/edit/' + item.id">
										<v-list-tile-avatar><v-icon>edit</v-icon></v-list-tile-avatar>
										<v-list-tile-title>Edit</v-list-tile-title>
									</v-list-tile>
									<v-list-tile @click="deleteClicked(item)">
										<v-list-tile-avatar><v-icon>delete</v-icon></v-list-tile-avatar>
										<v-list-tile-title>Delete</v-list-tile-title>
									</v-list-tile>
									</v-list>
								</v-menu>
							</v-list-tile-action>
						</v-list-tile>
					</v-list>
				</v-card>
			</v-flex>
		</v-layout>
		<v-btn fixed fab bottom right color="accent" to="/scripts/new"><v-icon class="fix-fab-icon">add</v-icon></v-btn>

		<v-dialog :value="true" v-if="toExecuteScript != null" persistent>
			<v-card>
				<v-card-title class="headline">Execute {{toExecuteScript.name}}</v-card-title>
				<v-card-text>
					Provide some arguments for the function seperated by a space
					<v-flex xs12 md6>
						<v-text-field v-model="executeArgs" label="args"></v-text-field>
					</v-flex>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="accent" flat @click="cancelExecute()">CANCEL</v-btn>
					<v-btn color="primary" flat @click="executeScript()">EXECUTE</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-dialog :value="true" max-width="250" v-if="toDeleteScript != null" persistent>
			<v-card>
				<v-card-title class="headline">Warning</v-card-title>
				<v-card-text>
					Are you sure you want to delete script "{{toDeleteScript.name}}"? This action cannot be undone.
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="accent" flat @click="cancelDelete()">NO</v-btn>
					<v-btn color="primary" flat @click="deleteScript()">YES</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Script } from '@/classes/script';
import { scriptService } from '@/services/script-service';

export default Vue.extend({
	data(){
		return {
			toDeleteScript:null as Script,
			toExecuteScript:null as Script,
			executeArgs:"",
			scriptService
		}
	},
	computed:{
		items():Script[]{
			return this.scriptService.scripts;
		}
	},
	methods:{
		deleteClicked(script:Script){
			this.toDeleteScript = script;
		},
		async deleteScript(){
			await this.toDeleteScript.remove();
			this.toDeleteScript = null;
		},
		executeClicked(item:Script){
			this.executeArgs = "";
			this.toExecuteScript = item;
		},
		cancelExecute(){
			this.toExecuteScript = null;
		},
		async executeScript(){
			let args = this.executeArgs.split(" ");
			await this.toExecuteScript.execute(args);
			this.toExecuteScript = null;
		}
	},
	mounted(){
		scriptService.getScripts();
	}
})
</script>

<style scoped>
.fix-fab-icon{
	height: auto;
	width: auto;
}
</style>
