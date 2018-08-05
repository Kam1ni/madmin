<template>
	<v-container fluid>
        <v-layout row wrap justify-center>
            <v-flex xs12 md10 lg6>
				<v-subheader>{{title}}</v-subheader>
                <v-card>
					<v-form>
						<v-card-text>
							<v-layout>
								<v-flex xs12 md6>
									<v-text-field label="username" v-model="user.username"></v-text-field>
								</v-flex>
								<v-flex xs12 md6>
									<v-checkbox label="is admin" v-model="user.isAdmin"></v-checkbox>
								</v-flex>
							</v-layout>
							<v-layout>
								<v-checkbox v-if="!isNew" label="change password?" v-model="changePassword"/>
								<template v-if="changePassword || isNew">
									<v-flex xs12>
										<v-layout>
											<v-flex xs12 md6>
												<v-text-field type="password" label="new password" v-model="user.password"></v-text-field>
											</v-flex>
										</v-layout>
										<v-layout>
											<v-flex xs12 md6>
												<v-text-field type="password" label="retype password" v-model="retypePassword"></v-text-field>
											</v-flex>
										</v-layout>
									</v-flex>
								</template>
							</v-layout>
						</v-card-text>
						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn color="accent" depressed @click="cancelDialog = true">Cancel</v-btn>
							<v-btn color="primary" depressed @click="save()">Save</v-btn>
						</v-card-actions>
					</v-form>
                </v-card>
            </v-flex>
        </v-layout>

		<v-dialog :value="cancelDialog" max-width="400">
			<v-card>
				<v-card-text>
					Are you sure you want to stop editing
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn flat color="accent" @click="cancelDialog = false">NO</v-btn>
					<v-btn flat color="primary" @click="cancel">YES</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-container>
</template>

<script; lang="ts">;
import Vue from 'vue';
import { User } from '@/classes/user';
import { userService } from '@/services/user-service';
export default Vue.extend({
	data(){
		return {
			user:<User|null>null,
			changePassword: false,
			retypePassword:<string|null> null,
			cancelDialog:false
		};
	},
	watch:{
		changePassword(newVal){
			if (newVal){
				this.user.password = null;
			}
		}
	},
	computed:{
		isNew():boolean{
			return !this.user.created;
		},
		title():string{
			if (!this.isNew){
				return "Edit user " + this.user.username;
			}else{
				return "Create new user";
			}
		},
		passwordsMatch():boolean{
			return this.user.password == this.retypePassword;
		}
	},
	methods:{
		cancel(){
			this.$router.go(-1);
		},
		async save(){
			if (this.changePassword || this.isNew){
				if (!this.passwordsMatch){
					return console.error("Passwords dont match");
				}
			}
			await this.user.save();
			this.$router.go(-1);
		}
	},
	destroyed(){
		this.user.password = null;
	},
	async created(){
		let id = this.$route.params.id;
		if (!id){
			this.user = new User();
		}else{
			this.user = userService.users.find(u=>u.id == id);
			if (!this.user){
				this.user = new User();
				this.user = await userService.getUser(id);
			}
		}
	}
})
</script>
