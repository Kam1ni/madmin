<template>
	<v-card>
		<v-card-title class="headline">Writing handlers</v-card-title>
		<v-card-text>
			Madmin handlers are not much more then JavaScript code saved as a string that gets triggered when the provided path gets called via one of the configured methods.
			The code is converted before execution into a JavaScript AsyncFunction. 
			This means you can use await inside the handler. 
			The code is first handled via expressjs v4 (see <a href="https://expressjs.com/en/4x/api.html" target="_blank">expressjs.com/</a> for details ) before it gets executed. 
			Sending a response is still a responsibility the users code. So don't forget to call res.send, or res.json, or one of the other reply functions on the res parameter.
			On execution the next four arguments are passed into the handler.
			<ul>
				<li>madmin: a static object where you can store volatile data in or make queries (More info comming soon)</li>
				<li>req: express request object (see <a href="https://expressjs.com/en/4x/api.html#req" target="_blank">expressjs request docs</a> for details)</li>
				<li>res: express response object (see <a href="https://expressjs.com/en/4x/api.html#res" target="_blank">expressjs response docs</a> for details)</li>
				<li>require: the standard Node.js require function</li>
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