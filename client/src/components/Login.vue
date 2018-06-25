<template>
	<v-app>
		<v-layout row justify-center wrap align-center fill-height>
			<v-flex xs12>
				<v-layout row wrap>
					<v-flex xs12 text-xs-center class="login-title">
						Madmin
					</v-flex>
				</v-layout>
				<v-layout row wrap justify-center>
					<v-flex xs12 md5>
						<v-card row wrap>
							<v-card-text>
							<v-card-text>
								<v-text-field label="Username"></v-text-field>
								<v-text-field label="Password" type="password"></v-text-field>
								<v-btn color="primary" block depressed @click="login()">LOGIN</v-btn>
							</v-card-text>
							</v-card-text>
						</v-card>
					</v-flex>
				</v-layout>
			</v-flex>
		</v-layout>
	</v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import { authService } from '@/services/auth-service';

export default Vue.extend({
	methods:{
		login(){
			console.log("login");
			authService.login();
		}
	}
});
</script>

<style scoped>
.login-title{
	font-size: 2.5rem;
	font-weight: 300;
}

.container {
	height: 100%;
}
</style>


