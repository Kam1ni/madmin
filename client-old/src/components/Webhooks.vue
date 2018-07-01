<template>
	<v-layout>
		<v-flex xs12>
			<v-card>
				<v-card-title class="headline">Webhooks</v-card-title>
				<v-card-text>
					<v-list>
						<v-list-tile v-for="(webhook, i) in webhooks" :key="i">
							<v-list-tile-title>{{webhook.path}}</v-list-tile-title>
							<v-list-tile-action @click="editwebhook(webhook)">
								<v-icon>edit</v-icon>
							</v-list-tile-action>
							<v-list-tile-action @click="confirmDeletewebhook(webhook)">
								<v-icon>delete</v-icon>
							</v-list-tile-action>
						</v-list-tile>
					</v-list>
				</v-card-text>
			</v-card>
		</v-flex>
		<v-dialog v-model="webhookDialog" max-width="700" persistent>
			<v-card v-if="toEditwebhook">
				<v-card-title class="headline">{{toEditwebhook._id ? "Edit webhook" : "New webhook"}}</v-card-title>
				<v-card-text>
					<v-layout wrap>
						<v-flex xs12>
							<v-text-field label="path" v-model="toEditwebhook.path"></v-text-field>
						</v-flex>
						<v-flex xs12>
							<v-text-field label="handler" multi-line v-model="toEditwebhook.handler"></v-text-field>
						</v-flex>
					</v-layout>
				</v-card-text>
				<v-card-actions>
					<v-btn flat @click="savewebhook">Save</v-btn>
					<v-btn flat @click="cancelEditwebhook">Cancel</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<app-confirm-dialog v-model="deleteDialog" @yes="deletewebhook" max-width="500"><span v-if="toDeletewebhook"  max-width="500">Are you sure you want to delete webhook {{toDeletewebhook.path}} {{toDeletewebhook.handler}}</span></app-confirm-dialog>
		<v-btn color="accent" fixed dark fab bottom right @click="addwebhook"><v-icon>add</v-icon></v-btn>
	</v-layout>
</template>

<script>
export default {
	data(){
		return {
			webhooks: [],
			webhookDialog: false,
			toEditwebhook: null,
			toDeletewebhook: null,
			deleteDialog: false
		};
	},
	methods:{
		editwebhook(webhook){
			this.toEditwebhook = webhook;
			this.webhookDialog = true;
		},
		cancelEditwebhook(){
			this.webhookDialog = false;
			this.toEditwebhook = null;
		},
		confirmDeletewebhook(webhook){
			this.toDeletewebhook = webhook;
			this.deleteDialog = true;
		},
		async deletewebhook(){
			try{
				console.log("removing", this.toDeletewebhook);
				await this.webhookRes.remove({id:this.toDeletewebhook._id});
				this.fetchwebhooks();
			}catch(err){
				console.log(err);
			}
		},
		async fetchwebhooks(){
			try{
				this.webhooks = (await this.webhookRes.get()).body;
				console.log(this.webhooks);
			}catch(err){
				console.log(err);
			}
		},
		async savewebhook(){
			try{
				if (this.toEditwebhook._id){
					await this.webhookRes.update({id:this.toEditwebhook._id}, this.toEditwebhook);
				}else{
					await this.webhookRes.save({}, this.toEditwebhook);
				}
				this.fetchwebhooks();
				this.webhookDialog = false;
			}catch(err){
				console.log(err);
			}
		},
		addwebhook(){
			this.toEditwebhook = {path:"", handler:""};
			this.webhookDialog = true;
		}
	},
	async created(){
		this.webhookRes = this.$resource("webhook{/id}");
		await this.fetchwebhooks();
	}
}
</script>