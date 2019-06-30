<template>
    <v-card>
        <v-list two-line class="no-padding">
            <v-list-tile>
                <v-list-tile-content>
                    <v-list-tile-title>Version</v-list-tile-title>
                    <v-list-tile-sub-title>{{settings.version}}</v-list-tile-sub-title>
                </v-list-tile-content>
            </v-list-tile>
            <v-divider></v-divider>
            <v-list-tile>
                <v-list-tile-content>
                    <v-list-tile-title>Default redirect</v-list-tile-title>
                    <v-list-tile-sub-title>{{settings.defaultRedirect}}</v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                    <v-btn icon @click="changeDefaultRedirect = true"><v-icon>edit</v-icon></v-btn>
                </v-list-tile-action>
            </v-list-tile>
        </v-list>

        <v-dialog v-model="changeDefaultRedirect" max-width="500">
            <v-card>
                <v-card-text>
                    <p>Edit default redirect</p>
                    <v-text-field label="Redirect subdomain" v-model="defaultRedirectText"></v-text-field>
                </v-card-text>            
                <v-card-actions>
                    <v-spacer/>
                    <v-btn flat color="accent" @click="changeDefaultRedirect = false">Cancel</v-btn>
                    <v-btn flat color="primary" @click="saveNewDefaultRedirect()">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { AppSettings } from '@/classes/app-settings';
export default Vue.extend({
    data(){
        return {
            changeDefaultRedirect:false,
            defaultRedirectText:this.settings.defaultRedirect
        };
    },
    props:{
        settings:{
            type:Object as ()=>AppSettings,
            required:true
        }
    },
    methods:{
        async saveNewDefaultRedirect(){
            await AppSettings.updateDefaultRedirect(this.defaultRedirectText);
            this.changeDefaultRedirect = false;
        }
    }
})
</script>

