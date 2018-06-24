import Vue from 'vue';

class AuthService extends Vue {
	isLoggedIn:boolean = false;
}

export const authService = new AuthService();