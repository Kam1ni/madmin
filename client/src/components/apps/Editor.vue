<template>
	<v-card>
		<v-form ref="form" v-model="valid">
			<v-card-text>
				<v-layout row wrap align-center>
					<v-flex xs12 md6 xl4 column>
						<v-text-field label="Subdomain" v-model="app.subdomain" :rules="subdomainRules"></v-text-field>
					</v-flex>
					<v-flex xs12 md6 xl8 column >
						{{fullDomain}}
					</v-flex>
				</v-layout>
				<v-layout row wrap>
					<v-flex xs12 md6 xl4 column>
						<v-select label="App type" :items="appTypes" v-model="app.type" :rules="typeRules"></v-select>
					</v-flex>
				</v-layout>
				<Static :app="app" v-if="app.type == 'static'"></Static>
				<Proxy :app="app" v-else-if="app.type == 'proxy'"></Proxy>
			</v-card-text>
			<v-card-actions>
				<v-flex class="text-xs-right">
					<v-btn flat color="accent" @click="cancel">Cancel</v-btn>
					<v-btn flat color="primary" :disabled="!valid" @click="submit">Submit</v-btn>
				</v-flex>
			</v-card-actions>
		</v-form>
	</v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { applicationConfig } from '@/app-config';
import { isStringNullOrWhiteSpace, stringHasWhiteSpace } from '@/functions/string';
import { appService } from '@/services/app-service';
import Static from './Static.vue';
import Proxy from './Proxy.vue';
import { App } from '@/classes/app';

export default Vue.extend({
	data(){
		return {
			valid:false,
			subdomainRules:[
				(v:string) => !isStringNullOrWhiteSpace(v) || "Subdomain may not be empty",
				(v:string) => !stringHasWhiteSpace(v) || "Subdomain may not have spaces",
				(v:string) => !appService.domainInUse(v, this.app.id) || "Subdomain must be unique"
			],
			typeRules:[
				(v:string) => v != null || "You must select a type"
			],
			appTypes:[
				"static",
				"proxy"
			]
		};
	},
	computed:{
		fullDomain():string{
			if (isStringNullOrWhiteSpace(this.app.subdomain)){
				return "Invalid url";
			}
			return (<App>this.app).fullUrl;
		}
	},
	props:["app"],
	methods:{
		submit(){
			this.$emit("submit", this.app);
		},
		cancel(){
			this.$router.go(-1);
		}
	},
	components:{
		Static,
		Proxy
	}
})
</script>