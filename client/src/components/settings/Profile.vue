<template>
    <v-card>
        <v-list two-line class="no-padding">
            <v-list-tile>
                <v-list-tile-content>
                    <v-list-tile-title>Tokens</v-list-tile-title>
                    <v-list-tile-sub-title>Manage your login tokens</v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                    <v-btn icon to="/settings/tokens"><v-icon>keyboard_arrow_right</v-icon></v-btn>
                </v-list-tile-action>
            </v-list-tile>
            <v-divider></v-divider>
            <v-list-tile @click="logout">
                <v-list-tile-content>
                    <v-list-tile-title>Logout</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
        </v-list>
    </v-card>    
</template>

<script lang="ts">
import Vue from 'vue'
import { authService } from '@/services/auth-service';
export default Vue.extend({
    methods:{
        logout(){
            authService.logout();
        }
    }
})
</script>
