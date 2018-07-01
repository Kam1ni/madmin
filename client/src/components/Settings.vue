<template>
	<v-layout>
		<v-flex xs12>
			<v-list>
				<v-list-tile v-for="(setting, i) in settings" :key="i" @click="openEditSettingModal(setting)">
					<v-list-tile-content>
						<v-list-tile-title>{{setting.friendlyName}}</v-list-tile-title>
						<v-list-tile-sub-title>{{setting.value}}</v-list-tile-sub-title>
					</v-list-tile-content>
				</v-list-tile>
			</v-list>
		</v-flex>
		<v-dialog v-model="showEdit" max-width="500">
			<v-toolbar><v-toolbar-title>Edit Setting</v-toolbar-title></v-toolbar>
			<v-card v-if="editSetting">
				<v-card-title class="headline">{{editSetting.friendlyName}}</v-card-title>
				<v-card-text>{{editSetting.description}}</v-card-text>
				<v-card-text>
					<v-layout>
					<v-flex xs4>
						<v-subheader>Value: {{editSetting.value}}</v-subheader>
					</v-flex>
					<v-flex xs8>
						<v-text-field
							label="New value" v-model="newValue"/>
					</v-flex>
					</v-layout>
				</v-card-text>
				<v-divider/>
				<v-card-actions>
					<v-btn flat @click="saveSetting">Save</v-btn>
					<v-btn flat @click="showEdit=false">Cancel</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-layout>
</template>

<script>
import Vue from 'vue';

export default {
	data(){
		return {settings: [], showEdit:false, editSetting: null, newValue:""};
	},
	methods:{
		openEditSettingModal(setting){
			console.log(setting);
			this.newValue = "";
			this.editSetting = setting;
			this.showEdit = true;
		},
		async saveSetting(){
			try{
				await this.$http.put(Vue.http.options.root + "/settings/" + this.editSetting.name, {value: this.newValue});
				this.editSetting.value = this.newValue;
				this.showEdit = false;
			}catch(err){
				console.log(err);
			}
		}
	},
	async mounted(){
		console.log("Creating");
		try{
			this.settings = (await this.$http.get(Vue.http.options.root + "/settings")).data;
			console.log(this.settings);
		}catch(err){
			console.log(err);
		}
		console.log("Created");
	}
}
</script>

