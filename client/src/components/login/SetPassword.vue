<template>
	<v-card>
		<v-card-text>
		<v-card-text>
			Your account doesn't appear to have a password. Please set a new one!
			<v-text-field type="password" label="new password" v-model="password"></v-text-field>
			<v-text-field type="password" label="retype password" v-model="retypedPassword"></v-text-field>
			<v-alert :value="errorMessage != null" type="error" transition="slide-y-transition">
				{{errorMessage}}
			</v-alert>
			<v-btn :loading="processing" :disabled="processing || !passwordsMatch || !passwordValid" color="primary" block depressed @click="setPassword()">SET PASSWORD</v-btn>
			<v-btn color="accent" block depressed @click="goBack()">BACK</v-btn>
		</v-card-text>
		</v-card-text>
	</v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { authService } from '@/services/auth-service';
import { AxiosResponse } from 'axios';
export default Vue.extend({
	data(){
		return {
			processing:false,
			password:"",
			retypedPassword:"",
			errorMessage:<string|null>null
		}
	},
	computed:{
		passwordsMatch():boolean{
			return this.password == this.retypedPassword;
		},
		passwordValid():boolean{
			return this.password != null && this.password.match(/.+/) != null;
		}
	},
	methods:{
		async setPassword(){
			this.processing = true;
			try{
				this.errorMessage = null;
				await authService.setNewPassword(this.password);
			}catch(err){
				let ex:AxiosResponse = err;
				this.errorMessage = ex.data.message;
			}
			this.processing = false;
		},
		goBack(){
			authService.cancelLogin();
		}
	}
})
</script>
