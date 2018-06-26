<template>
	<v-card row wrap>
		<v-card-text>
		<v-card-text>
			<v-form v-model="valid" ref="form" @submit="login" @keyup.native.enter="login">
				<v-text-field v-model="username" label="Username" required></v-text-field>
				<v-text-field v-model="password" label="Password" type="password" required></v-text-field>
				<v-alert :value="errorMessage != null" type="error" transition="slide-y-transition">
					{{errorMessage}}
				</v-alert>
				<v-btn :loading="logingIn" :disabled="logingIn" color="primary" block depressed @click="login">LOGIN</v-btn>
			</v-form>
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
			valid:true,
			logingIn:false,
			username:<string|null>null,
			password:<string|null>null,
			errorMessage:<string|null>null
		};
	},
	methods:{
		async login(){
			if (this.logingIn) return;
			if (!(<HTMLFormElement>this.$refs.form).validate()){
				return this.errorMessage = "Login values are invalid";
			}
			this.logingIn = true;
			console.log("login");
			try{
				this.errorMessage = null;
				await authService.login(this.username, this.password);
			}catch(err){
				console.log("error caught");
				let ex:AxiosResponse = err;
				this.errorMessage = ex.data.message;
			}
			this.logingIn = false;
		}
	}
});
</script>