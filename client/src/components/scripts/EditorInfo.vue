<template>
	<v-card>
		<v-card-title class="headline">Writing scripts</v-card-title>
		<v-card-text>
			Madmin scripts are not much more then JavaScript code saved as a string.
			The code is converted before execution into a JavaScript AsyncFunction. 
			This means you can use await inside the script.
			On execution the next three arguments are passed into the script.
			<ul>
				<li>madmin: a static object where you can store volatile data in or make queries (More info comming soon)</li>
				<li>require: the standard Node.js require function</li>
				<li>args: a list of string args that you can send before execution</li>
			</ul>
		</v-card-text>
		<v-card-actions>
			<v-spacer/>
			<v-btn flat color="accent" @click="close()">Close</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
	methods:{
		close(){
			this.$emit("close")
		}
	}
})
</script>