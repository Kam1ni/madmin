<template>
	<v-card>
		<v-form>
			<codemirror :value="content"></codemirror>
			<v-card-actions>
				<v-spacer/>
				<v-btn depressed color="accent" @click="cancel()">Cancel</v-btn>
				<v-btn depressed color="primary" @click="save()">Save</v-btn>
			</v-card-actions>
		</v-form>
	</v-card>
</template>

<script lang="ts">
import Vue from 'vue'
const {codemirror} = require('vue-codemirror')
export default Vue.extend({
	props:{
		content:{
			type:String,
			required:true
		},
		path:{
			type:String,
			required:true
		}
	},
	methods:{
		cancel(){
			let path = this.path.split("/");
			path.pop();
			this.$router.push(`/fs/${path.join("/")}`);
		},
		save(){

		}
	},
	components:{
		codemirror
	}
})
</script>
