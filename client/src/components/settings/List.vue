<template>
    <transition name="expand-vertical" mode="in-out">
        <v-container fluid>
            <v-layout row wrap justify-center>
                <v-flex xs12 md10 lg6 v-if="user.isAdmin">
                    <v-subheader :settings="settings">Application</v-subheader>
                    <Application v-if="settings" :settings="settings"/>
                    <v-flex xs12 class="text-xs-center" v-else>
        			    <v-progress-circular color="accent" :indeterminate="true"></v-progress-circular>
                    </v-flex>
                </v-flex>
            </v-layout>

            <v-layout row wrap justify-center>
                <v-flex xs12 md10 lg6 v-if="user.isAdmin">
                    <v-subheader>Users</v-subheader>
                    <Users/>
                </v-flex>
            </v-layout>

            <v-layout row wrap justify-center>
                <v-flex xs12 md10 lg6>
                    <v-subheader>Profile</v-subheader>
                    <Profile/>
                </v-flex>
            </v-layout>
        </v-container>
    </transition>
</template>

<script lang="ts">
import Vue from 'vue'
import Application from './Application.vue';
import Users from './Users.vue';
import Profile from './Profile.vue';
import { authService } from '@/services/auth-service';
import { configService } from '@/services/config-service';
import { AppSettings } from '@/classes/app-settings';

export default Vue.extend({
    data(){
        return {
            user:authService.user.value,
            settings:<AppSettings|null>null,
            subs:[]
        };
    },
    components:{
        Application,
        Users,
        Profile
    },
    mounted(){
        this.subs = [
            configService.appSettings.subscribe(val=>{
                this.settings = val;
            })
        ];
    },
    destroyed(){
        this.subs.forEach((sub)=>{
            sub.unsubscribe();
        });
    }
})
</script>

<style scoped>
.expand-vertical-enter{
    height: 0;
}

.expand-vertical-enter-active{
    transition:2s;
}

.expand-vertical-laeve-active{
    transition: 0;
    height: 0;
}

</style>