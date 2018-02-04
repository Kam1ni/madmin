<template>
	<v-layout>
		<v-flex xs12>
			<v-card>
				<v-card-title class="headline">Statics</v-card-title>
				<v-card-text>
					<v-list>
						<v-list-tile v-for="(thisStatic, i) in statics" :key="i">
							<v-list-tile-title>{{thisStatic.subdomain}}</v-list-tile-title>
							<v-list-tile-sub-title>{{thisStatic.path}}</v-list-tile-sub-title>
							<v-list-tile-action @click="editStatic(thisStatic)">
								<v-icon>edit</v-icon>
							</v-list-tile-action>
							<v-list-tile-action @click="confirmDeleteStatic(thisStatic)">
								<v-icon>delete</v-icon>
							</v-list-tile-action>
						</v-list-tile>
					</v-list>
				</v-card-text>
			</v-card>
		</v-flex>
		<v-dialog v-model="staticDialog" max-width="500px" persistent>
			<v-card v-if="toEditStatic">
				<v-card-title class="headline">{{toEditStatic._id ? "Edit static" : "New static"}}</v-card-title>
				<v-card-text>
					<v-layout wrap>
						<v-flex xs12 sm6>
							<v-text-field label="Subdomain" v-model="toEditStatic.subdomain"></v-text-field>
						</v-flex>
						<v-flex xs12 sm6>
							<v-text-field label="path" v-model="toEditStatic.path"></v-text-field>
						</v-flex>
					</v-layout>
				</v-card-text>
				<v-card-actions>
					<v-btn flat @click="saveStatic">Save</v-btn>
					<v-btn flat @click="cancelEditStatic">Cancel</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<app-confirm-dialog v-model="deleteDialog" @yes="deleteStatic" max-width="500"><span v-if="toDeleteStatic"  max-width="500">Are you sure you want to delete static {{toDeleteStatic.subdomain}} {{toDeleteStatic.path}}</span></app-confirm-dialog>
		<v-btn color="accent" fixed dark fab bottom right @click="addStatic"><v-icon>add</v-icon></v-btn>
	</v-layout>
</template>

<script>
export default {
	data(){
		return {
			statics: [],
			staticDialog: false,
			toEditStatic: null,
			toDeleteStatic: null,
			deleteDialog: false
		};
	},
	methods:{
		editStatic(thisStatic){
			this.toEditStatic = thisStatic;
			this.staticDialog = true;
		},
		cancelEditStatic(){
			this.staticDialog = false;
			this.toEditStatic = null;
		},
		confirmDeleteStatic(thisStatic){
			this.toDeleteStatic = thisStatic;
			this.deleteDialog = true;
		},
		async deleteStatic(){
			try{
				console.log("removing", this.toDeleteStatic);
				await this.staticRes.remove({id:this.toDeleteStatic._id});
				this.fetchStatics();
			}catch(err){
				console.log(err);
			}
		},
		async fetchStatics(){
			try{
				this.statics = (await this.staticRes.get()).body;
				console.log(this.statics);
			}catch(err){
				console.log(err);
			}
		},
		async saveStatic(){
			try{
				if (this.toEditStatic._id){
					await this.staticRes.update({id:this.toEditStatic._id}, this.toEditStatic);
				}else{
					await this.staticRes.save({}, this.toEditStatic);
				}
				this.fetchStatics();
				this.staticDialog = false;
			}catch(err){
				console.log(err);
			}
		},
		addStatic(){
			this.toEditStatic = {subdomain:"", path:""};
			this.staticDialog = true;
		}
	},
	async created(){
		this.staticRes = this.$resource("static{/id}");
		await this.fetchStatics();
	}
}
</script>