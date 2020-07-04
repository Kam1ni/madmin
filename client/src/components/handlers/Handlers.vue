<template>
	<v-container fluid grid-list-md fill-height>
		<v-layout align-center justify-center v-if="items == null">
			<v-progress-circular color="accent" :indeterminate="true"></v-progress-circular>
		</v-layout>
		<v-layout align-center justify-center v-else-if="items.length == 0">
			<v-subheader>No handlers available</v-subheader> 
		</v-layout>
		<v-layout v-else row wrap justify-center>
			<v-flex xs12 md10 lg6>
				<v-subheader>Handlers</v-subheader>
				<v-card>
					<v-list>
						<v-list-tile v-for="item in items" :key="item.id">
							<v-list-tile-avatar>
								<v-icon large :color="getPowerColor(item)">power_settings_new</v-icon>
							</v-list-tile-avatar>
							<v-list-tile-content>
								<v-list-tile-title v-html="item.path"></v-list-tile-title>
							</v-list-tile-content>
							<v-list-tile-action>
								<v-menu left>
									<v-btn icon slot="activator"><v-icon>more_vert</v-icon></v-btn>
									<v-list>
										<v-list-tile :to="'/handlers/edit/' + item.id">
										<v-list-tile-avatar><v-icon>edit</v-icon></v-list-tile-avatar>
										<v-list-tile-title>Edit</v-list-tile-title>
									</v-list-tile>
									<v-list-tile @click="item.enable()" v-if="!item.enabled">
										<v-list-tile-avatar><v-icon>power_settings_new</v-icon></v-list-tile-avatar>
										<v-list-tile-title>Enable</v-list-tile-title>
									</v-list-tile>
									<v-list-tile @click="item.disable()" v-else>
										<v-list-tile-avatar><v-icon>power_settings_new</v-icon></v-list-tile-avatar>
										<v-list-tile-title>Disable</v-list-tile-title>
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
		<v-btn fixed fab bottom right color="accent" to="/handlers/new"><v-icon>add</v-icon></v-btn>
		<v-dialog :value="true" max-width="250" v-if="toDeleteHandler != null" persistent>
			<v-card>
				<v-card-title class="headline">Warning</v-card-title>
				<v-card-text>
					Are you sure you want to delete handler "{{toDeleteHandler.path}}"? This action cannot be undone.
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="accent" flat @click="cancelDelete()">NO</v-btn>
					<v-btn color="primary" flat @click="deleteHandler()">YES</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import {Handler} from "@/classes/handler";
import { handlerService } from '@/services/handler-service';
export default Vue.extend({
	data(){
		return {
			toDeleteHandler:<null|Handler>null,
			handlerService
		}
	},
	computed:{
		items():Handler[]{
			return this.handlerService.handlers;
		}
	},
	methods:{
		deleteClicked(handler:Handler){
			this.toDeleteHandler = handler;
		},
		cancelDelete(){
			this.toDeleteHandler = null;
		},
		async deleteHandler(){
			await this.toDeleteHandler.remove();
		},
		getPowerColor(item:Handler){
			if (item.enabled){
				return "green";
			}else{
				return "red";
			}
		}
	},
	mounted(){
		handlerService.getHandlers();
	}
})
</script>

