<template>
    <v-container fluid>
        <v-layout row wrap justify-center>
            <v-flex xs12 md10 lg6>
                <v-card>
                    <v-btn icon @click="back()"><v-icon>arrow_back</v-icon></v-btn>Tokens
                    <v-list>
                        <v-list-tile v-for="(token, i) in user.tokens" :key="i">
                            <v-list-tile-content>
                                <v-list-tile-title>{{token.deviceName}}</v-list-tile-title>
                                <v-list-tile-sub-title>{{token.token}}</v-list-tile-sub-title>
                            </v-list-tile-content>
                            <v-list-tile-action-text v-if="token.token == currentToken">
                                <v-chip color="primary">current</v-chip>
                            </v-list-tile-action-text>
                            <v-list-tile-action v-else>
                                <v-btn icon><v-icon>delete</v-icon></v-btn>
                            </v-list-tile-action>
                        </v-list-tile>
                    </v-list>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { authService } from '@/services/auth-service';
export default Vue.extend({
    data(){
        return{
            user:authService.user.value,
            currentToken:authService.token
        }
    },
    methods:{
        back(){
            this.$router.back();
        }
    }
})
</script>

