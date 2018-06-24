<template>
	<v-app>
		<v-content>
			<v-card>
				<v-card-title>Madmin Login</v-card-title>
				<v-card-text>Card text</v-card-text>
				<v-card-actions>
					<v-btn flat>Button</v-btn>
				</v-card-actions>
			</v-card>
		</v-content>
	</v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import { authService } from "../services/auth-service";
import Component from 'vue-class-component';

@Component({
	components:{
		Login
	}
})
export default class Login extends Vue{
	authService = authService;
}

</script>

