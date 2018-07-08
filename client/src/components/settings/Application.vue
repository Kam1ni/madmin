<template>
    <v-card>
        <v-list>
            <v-list-tile>
                <v-list-tile-content>
                    <v-list-tile-title>Version</v-list-tile-title>
                    <v-list-tile-title>{{settings.version}}</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
                <v-list-tile-content>
                    <v-list-tile-title>Default redirect</v-list-tile-title>
                    <v-list-tile-sub-title>{{settings.defaultRedirect}}</v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                    <v-btn icon @click="changeDefaultRedirectClicked()"><v-icon>edit</v-icon></v-btn>
                </v-list-tile-action>
            </v-list-tile>
        </v-list>

        <v-dialog v-model="changeDefaultRedirect">
            <v-card>
                <v-card-text>
                    <v-text-field></v-text-field>
                </v-card-text>            
            </v-card>
        </v-dialog>
    </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    data:{
        changeDefaultRedirect:false
    },
    props:["settings"],
    methods:{
        changeDefaultRedirectClicked(){
            this.changeDefaultRedirect = true;
        }
    }
})
</script>

