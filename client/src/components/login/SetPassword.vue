<template>
	<v-card>
		<v-card-text>
		<v-card-text>
			Your account doesn't appear to have a password. Please set a new one!
			<v-text-field type="password" label="new password" v-model="password"></v-text-field>
			<v-text-field type="password" label="retype password" v-model="retypedPassword"></v-text-field>
			<v-btn :loading="processing" :disabled="processing || !passwordsMatch || !passwordValid" color="primary" block depressed @click="setPassword()">SET PASSWORD</v-btn>
			<v-btn color="accent" block depressed @click="goBack()">BACK</v-btn>
		</v-card-text>
		</v-card-text>
	</v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { authService } from '@/services/auth-service';
export default Vue.extend({
	data(){
		return {
			processing:false,
			password:"",
			retypedPassword:""
		}
	},
	computed:{
		passwordsMatch():boolean{
			console.log("Passwords match");
			return this.password == this.retypedPassword;
		},
		passwordValid():boolean{
			return this.password != null && this.password.match(/.+/) != null;
		}
	},
	methods:{
		async setPassword(){

		},
		goBack(){
			authService.cancelLogin();
		}
	}
})
</script>
