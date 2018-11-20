<template>
	<v-card max-width="500px">
		<v-card-title>Change password</v-card-title>
		<v-card-text>
			<v-flex xs12 md6>
				<v-text-field type="password" v-model="oldPassword" label="Old Password"></v-text-field>
			</v-flex>
			<v-flex xs12 md6>
				<v-text-field type="password" v-model="newPassowrd" label="New Password"></v-text-field>
			</v-flex>
			<v-flex xs12 md6>
				<v-text-field type="password" v-model="repeatPassword" label="Repeat Password"></v-text-field>
			</v-flex>
			<v-alert :value="errorMessage != null" type="error" v-if="errorMessage != ''" transition="slide-y-transition">
				{{errorMessage}}
			</v-alert>
		</v-card-text>
		<v-card-actions>
			<v-spacer/>
			<v-btn flat color="accent" @click="cancel()">Cancel</v-btn>
			<v-btn flat color="primary" @click="submit()">Submit</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { setTimeout } from 'timers';
import { authService } from '../../services/auth-service';
import { AxiosError } from '../../../../server/node_modules/axios';
export default Vue.extend({
	data(){
		return {
			oldPassword:"",
			newPassowrd:"",
			repeatPassword:"",
			errorMessage:"",
			errorTimer:<NodeJS.Timer|null>null
		}
	},
	methods:{
		showError(message:string){
			this.errorMessage = message;
			if (this.errorTimer){
				clearTimeout(this.errorTimer);
			}
			this.errorTimer = setTimeout(()=>{
				this.errorMessage = "";
			}, 6000);
		},
		cancel(){
			this.$emit("close")
		},
		async submit(){
			if (this.newPassowrd != this.repeatPassword){
				return this.showError("New password and repeat passwords dont match")
			}
			try{
				await authService.changePassword(this.oldPassword, this.newPassowrd);
				this.$emit("close");
			}catch(err){
				let ex = err as AxiosError;
				if (ex.response){
					return this.showError(ex.response.data.message);
				}
				this.showError("NETWORK ERROR");
			}
		}
	}
})
</script>
