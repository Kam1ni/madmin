<template>
    <transition name="expand-vertical" mode="in-out">
        <v-container fluid>
            <v-layout row wrap justify-center>
                <v-flex xs12 md10 lg6 v-if="authService.user.isAdmin">
                    <v-subheader>Application</v-subheader>
                    <Application v-if="configService.appSettings" :settings="configService.appSettings"/>
                    <v-flex xs12 class="text-xs-center" v-else>
        			    <v-progress-circular color="accent" :indeterminate="true"></v-progress-circular>
                    </v-flex>
                </v-flex>
            </v-layout>

            <v-layout row wrap justify-center>
                <v-flex xs12 md10 lg6 v-if="authService.user.isAdmin">
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
import { AppSettings } from '@/classes/app-settings';
import { ConfigService } from '@/services/config-service';

export default Vue.extend({
    data(){
        return {
            authService:authService,
            configService:ConfigService,
        };
    },
    components:{
        Application,
        Users,
        Profile
    },
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