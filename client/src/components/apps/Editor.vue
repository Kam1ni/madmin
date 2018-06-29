<template>
	<v-card>
		<v-form ref="form" :value="valid" lazy-validation>
			<v-card-text>
				<v-layout row wrap>
					<v-flex xs12 md6 lg4 column>
						<v-text-field label="Subdomain" v-model="app.subdomain" :rules="subdomainRuless"></v-text-field>
					</v-flex>
					<v-flex xs12 md6 lg8 column>
						{{fullDomain}}
					</v-flex>
				</v-layout>
			</v-card-text>
			<v-card-actions>
				<v-flex class="text-xs-right">
					<v-btn flat color="accent">Cancel</v-btn>
					<v-btn flat color="primary">Submit</v-btn>
				</v-flex>
			</v-card-actions>
		</v-form>
	</v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { applicationConfig } from '@/app-config';
import { isStringNullOrWhiteSpace, stringHasWhiteSpace } from '@/functions/string';
export default Vue.extend({
	data(){
		return {
			valid:false,
			subdomainRules:[
				(v:string) => !isStringNullOrWhiteSpace(v) || "Subdomain may not be empty",
				(v:string) => !stringHasWhiteSpace(v) || "Subdomain may not have spaces"
			]
		};
	},
	computed:{
		fullDomain():string{
			if (isStringNullOrWhiteSpace(this.app.subdomain)){
				return "Invalid url";
			}
			let url = applicationConfig.baseUrl.split("//");
			return url[0] + "//" + this.app.subdomain + "." + url[1];
		}
	},
	props:["app"],
	methods:{
		submit(){
			if ((<HTMLFormElement>this.$refs.form).validate()){
				this.$emit("submit", this.app);
			}
		}
	}
})
</script>