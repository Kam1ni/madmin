<template>
    <v-card>
        <v-list>
            <v-list-tile>
                <v-list-tile-content>
                    <v-list-tile-title>Tokens</v-list-tile-title>
                    <v-list-tile-sub-title>Manage your login tokens</v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                    <v-btn icon to="/settings/tokens"><v-icon>keyboard_arrow_right</v-icon></v-btn>
                </v-list-tile-action>
            </v-list-tile>
        </v-list>
    </v-card>    
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
})
</script>

