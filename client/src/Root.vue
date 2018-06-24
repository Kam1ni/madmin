<template>
	<Login v-if="!authService.isLoggedIn"></Login>
	<App v-else></App>
</template>

<script lang="ts">
import Vue from 'vue'
import { authService } from "./services/auth-service";
import Component from 'vue-class-component';
import Login from "./components/Login.vue";
import App from "./App.vue";

@Component({
	components:{
		Login,
		App
	}
})
export default class Root extends Vue{
	authService = authService;
}
</script>

