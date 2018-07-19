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
						<transition name="login-slide-transition" mode="out-in">
							<main-login></main-login>
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
import { authService } from '@/services/auth-service';
import MainLogin from '@/components/login/MainLogin.vue';
import { setTimeout } from 'timers';

export default Vue.extend({
	components:{
		MainLogin
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

.login-slide-transition-enter-active{
	transition: all .5s ease-in;
}

.login-slide-transition-enter{
	transform: translate(100%, 0);
	opacity: 0;
}

.login-slide-transition-leave-active{
	transition: all .5s ease-out;
	transform: translate(-100%, 0);
	opacity: 0;
}

</style>


