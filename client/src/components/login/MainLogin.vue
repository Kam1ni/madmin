<template>
	<v-card row wrap>
		<v-card-text>
		<v-card-text>
			<v-text-field v-model="username" label="Username"></v-text-field>
			<v-text-field v-model="password" label="Password" type="password"></v-text-field>
			<v-alert :value="errorMessage != null" type="error" transition="slide-y-transition">
				{{errorMessage}}
			</v-alert>
			<v-btn :loading="logingIn" :disabled="logingIn" color="primary" block depressed @click="login()">LOGIN</v-btn>
		</v-card-text>
		</v-card-text>
	</v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import { authService } from '@/services/auth-service';
import { AxiosResponse } from 'axios';

export default Vue.extend({
	data(){
		return {
			logingIn:false,
			username:"",
			password:"",
			errorMessage:<string|null>null
		};
	},
	methods:{
		async login(){
			if (this.logingIn) return;
			this.logingIn = true;
			console.log("login");
			try{
				this.errorMessage = null;
				await authService.login(this.username, this.password);
			}catch(err){
				let ex:AxiosResponse = err;
				this.errorMessage = ex.data.message;
			}
			this.logingIn = false;
		}
	}
});
</script>