<template>
	<v-card>
		<v-list>
			<v-list-tile @click="goUp()" v-if="path != '/'">
				<v-list-tile-title>..</v-list-tile-title>
			</v-list-tile>
			<v-list-tile v-for="(dir, i) of directories" :key="i" @click="goTo(dir.address)">
				<v-list-tile-avatar>
					<v-icon>folder</v-icon>
				</v-list-tile-avatar>
				<v-list-tile-title>{{dir.name}}</v-list-tile-title>
			</v-list-tile>
			<v-list-tile v-for="(file, i) of files" :key="i" @click="goTo(dir.address)">
				<v-list-tile-avatar>
					<v-icon>description</v-icon>
				</v-list-tile-avatar>
				<v-list-tile-title>{{file.name}}</v-list-tile-title>
			</v-list-tile>
		</v-list>
	</v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { FsFile } from '../../classes/fs-file';
import { FsDirectory } from '../../classes/fs-directory';
export default Vue.extend({
	props:{
		files:{
			type:Array as ()=>FsFile[],
			required:true
		},
		directories:{
			type:Array as ()=>FsDirectory[],
			required:true
		},
		path:{
			type:String,
			required:true
		}
	},
	methods:{
		goUp(){
			let path = this.path.split("/");
			path.pop();
			this.$router.push(`/fs/${path.join("/")}`);
		},
		goTo(address:string){
			this.$router.push(`/fs${address}`);
		}
	}
})
</script>
