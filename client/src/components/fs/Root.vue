<template>
	<v-container grid-list-md fill-height>
		<v-layout align-center justify-center v-if="!fetched">
			<v-progress-circular color="accent" :indeterminate="true"></v-progress-circular>
		</v-layout>
		<v-layout row wrap justify-center v-else>
			<v-flex xs12>
				<v-breadcrumbs :items="pathCrumbs" divider="/"/>
				<app-explorer :files="files" :directories="directories" :path="path" v-if="isDirectory"/>
				<app-editor :path="path" :content="content" v-else-if="isTextFile"/>
				<app-image-viewer :path="path" :content="content" :mime-type="mimeType" v-else-if="isImage"/>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { FsFile } from '../../classes/fs-file';
import { FsDirectory } from '../../classes/fs-directory';
import { fsService, FSResponseTypes } from '../../services/fs-service';
import AppExplorer from "./Explorer.vue";
import AppEditor from "./Editor.vue";
import AppImageViewer from "./ImageViewer.vue";

export default Vue.extend({
	data(){
		return {
			path:"/",
			files:[] as FsFile[],
			directories: [] as FsDirectory[],
			content:"",
			fetched:false,
			contentType:"directory" as FSResponseTypes,
			mimeType:"" as string | undefined
		}
	},
	computed:{
		pathCrumbs():any[]{
			let parts = this.path.split("/")
			return (parts.map((name, index)=>{
				return {
					text:name,
					to: "/fs/" + parts.filter((p, i)=> i <= index).join("/")
				};
			}));
		},
		isDirectory():boolean{
			return this.contentType == "directory";
		},
		isTextFile():boolean{
			return this.contentType == "text";
		},
		isImage():boolean{
			return this.contentType == "image";
		}
	},
	watch:{
		"$route.params.path"(){
			this.reload();
		}
	},
	methods:{
		async reload(){
			if (this.$route.params.path){
				this.path = this.$route.params.path;
			}else{
				this.path = "/"
			}
			if (this.path.charAt(0) != "/"){
				this.path = "/" + this.path;
			}
			let result = await fsService.openContent(this.path);
			console.log(result);
			this.mimeType = result.mimeType;
			this.contentType = result.type;
			this.files = [];
			this.directories = [];
			if (result.type == "directory"){
				this.files = result.content.files;
				this.directories = result.content.directories;
			}
			if (result.type == "text" || result.type == "image"){
				this.content = result.content;
			}
			this.fetched = true;
		}
	},
	async mounted(){
		await this.reload();
	},
	components:{
		AppExplorer,
		AppEditor,
		AppImageViewer
	}
})
</script>
