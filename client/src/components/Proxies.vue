<template>
	<v-layout>
		<v-flex xs12>
			<v-card>
				<v-card-title class="headline">Proxies</v-card-title>
				<v-card-text>
					<v-list>
						<v-list-tile v-for="(proxy, i) in proxies" :key="i">
							<v-list-tile-title>{{proxy.subdomain}}</v-list-tile-title>
							<v-list-tile-sub-title>{{proxy.endpoint}}</v-list-tile-sub-title>
							<v-list-tile-action @click="editProxy(proxy)">
								<v-icon>edit</v-icon>
							</v-list-tile-action>
							<v-list-tile-action @click="confirmDeleteProxy(proxy)">
								<v-icon>delete</v-icon>
							</v-list-tile-action>
						</v-list-tile>
					</v-list>
				</v-card-text>
			</v-card>
		</v-flex>
		<v-dialog v-model="proxyDialog" max-width="500px" persistent>
			<v-card v-if="toEditProxy">
				<v-card-title class="headline">{{toEditProxy._id ? "Edit Proxy" : "New Proxy"}}</v-card-title>
				<v-card-text>
					<v-layout wrap>
						<v-flex xs12 sm6>
							<v-text-field label="Subdomain" v-model="toEditProxy.subdomain"></v-text-field>
						</v-flex>
						<v-flex xs12 sm6>
							<v-text-field label="Endpoint" v-model="toEditProxy.endpoint"></v-text-field>
						</v-flex>
					</v-layout>
				</v-card-text>
				<v-card-actions>
					<v-btn flat @click="saveProxy">Save</v-btn>
					<v-btn flat @click="cancelEditProxy">Cancel</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<app-confirm-dialog v-model="deleteDialog" @yes="deleteProxy" max-width="500"><span v-if="toDeleteProxy"  max-width="500">Are you sure you want to delete proxy {{toDeleteProxy.subdomain}} {{toDeleteProxy.endpoint}}</span></app-confirm-dialog>
		<v-btn color="accent" fixed dark fab bottom right @click="addProxy"><v-icon>add</v-icon></v-btn>
	</v-layout>
</template>

<script>
export default {
	data(){
		return {
			proxies: [],
			proxyDialog: false,
			toEditProxy: null,
			toDeleteProxy: null,
			deleteDialog: false
		};
	},
	methods:{
		editProxy(proxy){
			this.toEditProxy = proxy;
			this.proxyDialog = true;
		},
		cancelEditProxy(){
			this.proxyDialog = false;
			this.toEditProxy = null;
		},
		confirmDeleteProxy(proxy){
			this.toDeleteProxy = proxy;
			this.deleteDialog = true;
		},
		async deleteProxy(){
			try{
				console.log("removing", this.toDeleteProxy);
				await this.proxyRes.remove({id:this.toDeleteProxy._id});
				this.fetchProxies();
			}catch(err){
				console.log(err);
			}
		},
		async fetchProxies(){
			try{
				this.proxies = (await this.proxyRes.get()).body;
				console.log(this.proxies);
			}catch(err){
				console.log(err);
			}
		},
		async saveProxy(){
			try{
				if (this.toEditProxy._id){
					await this.proxyRes.update({id:this.toEditProxy._id}, this.toEditProxy);
				}else{
					await this.proxyRes.save({}, this.toEditProxy);
				}
				this.fetchProxies();
				this.proxyDialog = false;
			}catch(err){
				console.log(err);
			}
		},
		addProxy(){
			this.toEditProxy = {subdomain:"", endpoint:""};
			this.proxyDialog = true;
		}
	},
	async created(){
		this.proxyRes = this.$resource("proxy{/id}");
		await this.fetchProxies();
	}
}
</script>