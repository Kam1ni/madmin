<template>
	<v-container fluid grid-list-md fill-height>
		<v-layout align-center justify-center v-if="items == null">
			<v-progress-circular color="accent" :indeterminate="true"></v-progress-circular>
		</v-layout>
		<v-layout align-center justify-center v-else-if="items.length == 0">
			No apps available
		</v-layout>
		<v-layout v-else row wrap justify-center="">
			<v-flex xs12 md10 lg6>
				Apps
				<v-card>
					<v-card-text>
						<v-list>
							<v-list-tile v-for="item in items" :key="item._id">
								<v-list-tile-content>
									<v-list-tile-title v-html="item.subdomain"></v-list-tile-title>
									<v-list-tile-sub-title v-html="item.type"></v-list-tile-sub-title>
								</v-list-tile-content>
								<v-list-tile-action>
									<v-switch label="enabled" v-model="item.enabledWeb"></v-switch>
								</v-list-tile-action>
								<v-list-tile-action>
									<v-btn icon :to="'/apps/edit/' + item._id"><v-icon>edit</v-icon></v-btn>
								</v-list-tile-action>
								<v-list-tile-action>
									<v-btn icon @click="deleteClicked(item)"><v-icon>delete</v-icon></v-btn>
								</v-list-tile-action>
							</v-list-tile>
						</v-list>
					</v-card-text>
				</v-card>
			</v-flex>
		</v-layout>
		<v-btn fixed fab bottom right color="accent" to="/apps/new"><v-icon class="fix-fab-icon">add</v-icon></v-btn>
		<v-dialog :value="true" max-width="250" v-if="toDeleteApp != null">
			<v-card>
				<v-card-title class="headline">Warning</v-card-title>
				<v-card-text>
					Are you sure you want to delete app "{{toDeleteApp.subdomain}}"? This action cannot be undone.
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="accent" flat @click="cancelDelete()">NO</v-btn>
					<v-btn color="primary" flat @click="deleteApp()">YES</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { App } from '@/classes/app';
import { appService } from '@/services/app-service';
export default Vue.extend({
	data(){
		return { 
			items:<App[]|null>null,
			subs:<any[]>[],
			toDeleteApp:<App|null>null,
		};
	},
	mounted(){
		this.subs = [
			appService.apps.subscribe(apps=>{
				this.items = apps;
			})
		];
		appService.getApps();
	},
	destroyed(){
		this.subs.forEach(sub=>{sub.unsubscribe()});
	},
	methods:{
		deleteClicked(item:App){
			this.toDeleteApp = item;
		},
		cancelDelete(){
			this.toDeleteApp = null;
		},
		async deleteApp(){
			await this.toDeleteApp.remove();
			this.toDeleteApp = null;
		}
	}
})
</script>

<style scoped>
.fix-fab-icon{
	height: auto;
	width: auto;
}
</style>


