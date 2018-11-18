<template>
    <v-card>
        <v-list two-line class="no-padding">
            <v-list-tile @click="createNewUser()">
                <v-list-tile-avatar>
                    <v-icon>add</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-title>
                    Create a new user
                </v-list-tile-title>
            </v-list-tile>
            <v-divider></v-divider>
            <template v-for="(user, i) in userService.users" >
                <v-list-tile :key="i">
                    <v-list-tile-content>
                        <v-list-tile-title>{{user.username}}</v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-action-text v-if="user.isAdmin">
                        <v-chip color="primary">admin</v-chip>
                    </v-list-tile-action-text>
                    <template v-if="authUser.isAdmin && authUser.id != user.id">
                        <v-list-tile-action>
                            <v-btn icon @click="editUser(user)"><v-icon>edit</v-icon></v-btn>
                        </v-list-tile-action>
                        <v-list-tile-action>
                            <v-btn icon @click="deleteUserClicked(user)"><v-icon>delete</v-icon></v-btn>
                        </v-list-tile-action>
                    </template>
                </v-list-tile>
                <v-divider :key="i + 'divider'" v-if="i != userService.users.length -1"/>
            </template>
        </v-list>

        <v-dialog :value="deleteModal" max-width="400" v-if="toDeleteUser">
            <v-card>
                <v-card-title class="headline">Warning</v-card-title>
                <v-card-text>
                    Are you sure you want to delete user {{toDeleteUser.username}}. This action cannot be undone.
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="accent" @click="deleteModal = false" flat>NO</v-btn>
                    <v-btn color="primary" @click="deleteUser(toDeleteUser)" flat>YES</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { userService } from '@/services/user-service';
import { authService } from '@/services/auth-service';
import { User } from '@/classes/user';
export default Vue.extend({
    data(){
        return {
            userService:userService,
            authService,
            toDeleteUser:<User|null>null,
            deleteModal:false
        }
    },
    computed:{
        authUser():User{
            console.log(authService.user);
            return this.authService.user;
        }
    },
    watch:{
        deleteModal(newVal:boolean){
            if (!newVal){
                this.toDeleteUser = null;
            }
        },
    },
    methods:{
        editUser(user:User){
            this.$router.push("/settings/user/edit/" + user.id);
        },
        deleteUserClicked(user:User){
            this.toDeleteUser = user;
            this.deleteModal = true;
        },
        async deleteUser(user:User){
            await user.remove();
            this.toDeleteUser = null;
            this.deleteModal = false;
        },
        createNewUser(){
            this.$router.push("/settings/user/new");
        }
    },
    mounted(){
        this.userService.getUsers()
    }
})
</script>

