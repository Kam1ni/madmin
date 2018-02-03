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
							<v-list-tile-actions></v-list-tile-actions>
						</v-list-tile>
					</v-list>
				</v-card-text>
			</v-card>
		</v-flex>
		<v-dialog v-model="proxyDialog">
			<v-card v-if="editProxy">
				<v-card-title class="headline">{{editProxy.subdomain}}</v-card-title>
			</v-card>
		</v-dialog>
	</v-layout>
</template>

<script>
export default {
	data(){
		return {
			proxies: [],
			proxyDialog: true,
			editProxy: {}
		};
	},
	async created(){
		this.proxyRes = this.$resource("proxy{/id}");
		try{
			this.proxies = (await this.proxyRes.get()).body;
			console.log(this.proxies);
		}catch(err){
			console.log(err);
		}
	}
}
</script>