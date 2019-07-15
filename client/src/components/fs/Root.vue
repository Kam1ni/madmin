<template>
	<v-container grid-list-md fill-height>
		<v-layout align-center justify-center v-if="!fetched">
			<v-progress-circular color="accent" :indeterminate="true"></v-progress-circular>
		</v-layout>
		<v-layout row wrap justify-center v-else>
			<v-flex xs12>
				<v-subheader>{{path}}</v-subheader>
				<app-explorer :files="files" :directories="directories" :path="path" v-if="isDirectory"/>
				<app-editor :path="path" :content="content" v-else/>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { FsFile } from '../../classes/fs-file';
import { FsDirectory } from '../../classes/fs-directory';
import { fsService } from '../../services/fs-service';
import AppExplorer from "./Explorer.vue";
import AppEditor from "./Editor.vue";

export default Vue.extend({
	data(){
		return {
			path:"/",
			files:[] as FsFile[],
			directories: [] as FsDirectory[],
			content:"",
			isDirectory:true,
			fetched:false
		}
	},
	watch:{
		"$route.params.path"(){
			this.reload();
		}
	},
	methods:{
		async reload(){
			console.log("Relaoding")
			if (this.$route.params.path){
				this.path = this.$route.params.path;
			}else{
				this.path = "/"
			}
			if (this.path.charAt(0) != "/"){
				this.path = "/" + this.path;
			}
			console.log(this.path);
			let result = await fsService.openContent(this.path);
			if (typeof(result) == "string"){
				this.isDirectory = false;
				this.content = result;
			}else{
				this.files = result.files;
				this.directories = result.directories;
				this.isDirectory = true;
			}
			this.fetched = true;
		}
	},
	async mounted(){
		await this.reload();
	},
	components:{
		AppExplorer,
		AppEditor
	}
})
</script>
