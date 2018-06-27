<template>
	<v-form ref="form" :value="valid">
		<v-text-field label="Subdomain"></v-text-field>
	</v-form>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
	data(){
		return {
			valid:false
		};
	}
})
</script>