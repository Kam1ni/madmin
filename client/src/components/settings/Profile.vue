<template>
    <v-card>
        <v-list two-line class="no-padding">
            <v-list-tile @click="changePassword">
                <v-list-tile-content>
                    <v-list-tile-title>Change password</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
            <v-divider></v-divider>
            <v-list-tile @click="logout">
                <v-list-tile-content>
                    <v-list-tile-title>Logout</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
        </v-list>
        <v-dialog v-model="changePassModal">
            <app-change-password v-if="changePassModal" @close="changePassModal = false"/>
        </v-dialog>
    </v-card>    
</template>

<script lang="ts">
import Vue from 'vue'
import { authService } from '@/services/auth-service';
import AppChangePassword from "./ChangePassword.vue";
export default Vue.extend({
    data(){
        return {
            changePassModal:false
        }
    },
    methods:{
        logout(){
            authService.logout();
        },
        changePassword(){
            this.changePassModal = true;
        }
    },
    components:{
        AppChangePassword
    }
})
</script>
