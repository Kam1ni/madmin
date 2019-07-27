<template>
	<v-card>
		<img :src="imageSrc"/>
	</v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { TextEncoder } from 'util';
export default Vue.extend({
	data(){
		return {
			imageSrc:""
		}
	},
	props:{
		content:{
			required:true
		},
		path:{
			type:String,
			required:true
		},
		mimeType:{
			type:String,
			required:true
		}
	},
	watch:{
		content:{
			immediate:true,
			handler(value:any){
				if (!value) return;
				this.removeURL();
				this.imageSrc = URL.createObjectURL(value);
			}
		}
	},
	methods:{
		removeURL(){
			if (this.imageSrc != ""){
				URL.revokeObjectURL(this.imageSrc);
			}
		}
	},
	destroyed(){
		this.removeURL();
	}
});
</script>
