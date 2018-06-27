<template>
	<v-container fluid fill-height>
		<v-layout align-center justify-center v-if="items == null">
			<v-progress-circular color="accent" :indeterminate="true"></v-progress-circular>
		</v-layout>
		<v-layout align-center justify-center v-else-if="items.length == 0">
			No apps available
		</v-layout>
		<v-layout v-else>
			<v-list>
				<v-list-tile v-for="item in items" :key="item._id">
					<v-list-tile-contetn>
						<v-list-tile-title v-html="item.subdomain"></v-list-tile-title>
						<v-list-tile-sub-title v-html="item.type"></v-list-tile-sub-title>
					</v-list-tile-contetn>
				</v-list-tile>
			</v-list>
		</v-layout>
		<v-btn fixed fab bottom right color="accent" small to="/apps/new"><v-icon class="fix-fab-icon">add</v-icon></v-btn>
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
			subs:<any[]>[]
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
	}
})
</script>

<style scoped>
.fix-fab-icon{
	height: auto;
	width: auto;
}
</style>


