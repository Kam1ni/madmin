<template>
	<Login v-if="!authService.isLoggedIn"></Login>
	<App v-else></App>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import Login from "./components/Login.vue";
import App from "./App.vue";
import {authService} from './services/auth-service';

export default Vue.extend({
	data(){
		return {authService};
	},
	components:{
		Login,
		App
	}
})

</script>

<style>
.no-padding{
	padding: 0;
}
</style>


