<template>
  <div class="home">
    
    
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import HelloWorld from '@/components/HelloWorld.vue'; 
import { api } from '../plugins/api';
import { server } from '../plugins/server';
import { LoginRequest } from 'common';


export default Vue.extend({
  name: 'home',
  components: {
    HelloWorld,
  },
  data: () => ({
    login: {
      id: '',
      password: ''
    } as LoginRequest
  }),
  mounted() {
    (window as any).server = server;
    (window as any).api = api;
  }
});
</script>
