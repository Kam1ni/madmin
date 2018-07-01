<template>
	<v-layout wrap>
		<v-flex xs12>
			<v-card>
				<v-card-title class="headline">Profile</v-card-title>
				<v-card-title>Logged in Devices</v-card-title>
				<v-card-text>
					<v-list>
						<v-list-tile v-for="(token, i) in tokens" :key="i">
							<v-list-tile-title>{{token.deviceName}}</v-list-tile-title>
							<v-list-tile-action @click="confirmDelete(token)"><v-icon>delete</v-icon></v-list-tile-action>
						</v-list-tile>
					</v-list>
				</v-card-text>
			</v-card>
			<app-confirm-dialog v-model="deleteDialog" @yes="deleteToken"><span v-if="toDeleteToken">Are you sure you want to delete {{toDeleteToken.deviceName}}?</span></app-confirm-dialog>
		</v-flex>
	</v-layout>
</template>

<script>
	export default {
		data(){
			return {
				tokens: [],
				deleteDialog: false,
				toDeleteToken: null
			}
		},
		methods:{
			confirmDelete(token){
				this.toDeleteToken = token;
				this.deleteDialog = true;
			},
			async deleteToken(){
				try{
					await this.$http.delete("auth/logout/" + this.toDeleteToken.token);
					await this.$AuthService.fetchProfile();
				}catch(err){
					console.log(err);
				}
			}
		},
		async created(){
			this.$AuthService.on("login", (user)=>{
				this.tokens = user.tokens
			});

			try{
				await this.$AuthService.fetchProfile();
			}catch(err){
				console.log(err);
			}
		}
	}
</script>