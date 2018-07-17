<template>
    <v-container fluid>
        <v-layout row wrap justify-center>
            <v-flex xs12 md10 lg6>
                <v-card>
                    <v-btn icon @click="back()"><v-icon>arrow_back</v-icon></v-btn>Tokens
                    <v-divider></v-divider>
                    <v-list two-line class="no-padding">
                        <template v-for="(token, i) in user.tokens" >
                            <v-list-tile :key="i">
                                <v-list-tile-content>
                                    <v-list-tile-title>{{token.deviceName}}</v-list-tile-title>
                                    <v-list-tile-sub-title>{{token.token}}</v-list-tile-sub-title>
                                </v-list-tile-content>
                                <v-list-tile-action-text v-if="token.token == currentToken">
                                    <v-chip color="primary">current</v-chip>
                                </v-list-tile-action-text>
                                <v-list-tile-action v-else>
                                    <v-btn icon @click="deleteTokenClicked(token)"><v-icon>delete</v-icon></v-btn>
                                </v-list-tile-action>
                            </v-list-tile>
                            <v-divider :key="i + 'divider'" v-if="i != user.tokens.length -1"/>
                        </template>
                    </v-list>
                </v-card>
            </v-flex>
            <v-dialog :value="true" v-if="toDeleteToken != null" max-width="400" persistent="true">
                <v-card>
                    <v-card-title class="headline">Warning</v-card-title>
                    <v-card-text>
                        Are you sure you want to delete token: "{{toDeleteToken.deviceName}}"?
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="accent" @click="toDeleteToken = null" flat>NO</v-btn>
                        <v-btn color="primary" @click="deleteToken()" flat>YES</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { authService } from '@/services/auth-service';
import { Token } from '@/classes/token';
import { User } from '@/classes/user';
export default Vue.extend({
    data(){
        return{
            authService,
            toDeleteToken:<null|Token>null
        };
    },
    computed:{
        currentToken():string{
            return this.authService.token;
        },
        user():User{
            return this.authService.user;
        }
    },
    methods:{
        back(){
            this.$router.back();
        },
        deleteTokenClicked(token:Token){
            this.toDeleteToken = token;
        },
        async deleteToken(){
            await authService.removeToken(this.toDeleteToken);
            this.toDeleteToken = null;
        }
    }
})
</script>

