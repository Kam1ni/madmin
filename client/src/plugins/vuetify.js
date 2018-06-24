import Vue from 'vue'
import * as Vuetify from 'vuetify'
import 'vuetify/src/stylus/app.styl'

Vue.use(Vuetify, {
	theme: {
		primary: "#2196F3",
		secondary: "#1E88E5",
		accent: "#FF9800",
		error: "#f44336",
		warning: "#ffeb3b",
		info: "#2196f3",
		success: "#4caf50"
	},
})