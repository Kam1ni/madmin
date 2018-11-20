<template>
    <router-view/>
</template>

<script lang="ts">
import Vue from 'vue'
import { ConfigService } from '../../services/config-service';


export default Vue.extend({
    mounted(){
        ConfigService.getSettings();
    }
})
</script>

