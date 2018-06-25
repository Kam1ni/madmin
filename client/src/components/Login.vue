<template>
	<v-app>
		<v-layout row justify-center wrap align-center fill-height>
			<v-flex xs12>
				<v-layout row wrap class="mb-5">
					<v-flex xs12 text-xs-center class="login-title">
						Madmin
					</v-flex>
					<v-flex xs12 text-xs-center class="primary--text sub-title">
						Your platform for server management
					</v-flex>
				</v-layout>
				<v-layout row wrap justify-center class="mb-5">
					<v-flex xs11 md5 xl3>
						<transition name="slide-x-transition" :after-leave="transitionItemLeft()">
							<main-login v-if="currentPage == 'main-login'"></main-login>
							<set-password v-if="currentPage == 'set-password'"></set-password>
						</transition>
					</v-flex>
				</v-layout>
				<v-layout row wrap>
					<v-flex xs12 text-xs-center>
						<img src="@/assets/logo.png" height="64px" alt="Madmin logo">
					</v-flex>
				</v-layout>
			</v-flex>
		</v-layout>
	</v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import { authService, LoginState } from '@/services/auth-service';
import MainLogin from '@/components/login/MainLogin.vue';
import SetPassword from '@/components/login/SetPassword.vue';
import { setTimeout } from 'timers';

export default Vue.extend({
	data(){
		return {
			loginState:LoginState.default,
			subscriptions:<any[]>[],
			currentPage:<string|null>null
		}
	},
	mounted(){
		this.currentPage = "main-login";
		this.subscriptions = [
			authService.loginState.subscribe(state=>{
				this.loginState = state;
				this.currentPage = null;
			})
		];
	},
	beforeDestroy(){
		this.subscriptions.forEach((sub)=>{
			sub.unsubscribe();
		});
	},
	methods:{
		async transitionItemLeft(){
			await Vue.nextTick();
			this.currentPage = this.loginState == LoginState.default ? "main-login" : "set-password";
		}
	},
	components:{
		MainLogin,SetPassword
	},
});
</script>

<style scoped>
.sub-title{
	font-weight: 300;
	font-size: 1.5rem;
}

.login-title{
	font-size: 2.5rem;
	font-weight: 300;
}

.container {
	height: 100%;
}

.invisible{
	visibility: hidden;
}
</style>


