import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify as any, {
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