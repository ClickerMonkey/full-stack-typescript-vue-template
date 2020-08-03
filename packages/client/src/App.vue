<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <div> 
      <input type="text" v-model="loginRequest.id">
      <input type="password" v-model="loginRequest.password">
      <button @click="login(loginRequest)">
        Login
      </button>
      <v-failures :value="loginFailures"></v-failures>
      <div v-if="loginLoading">
        Loading
      </div>
      <div>
        {{ auth }}
      </div>
      <button @click="logout">
        Logout
      </button>
    </div>
    <router-view/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Failures from '@/components/Failures.vue';
import { createNamespacedHelpers } from 'vuex-typescript-interface';
import { IAuthStore } from './stores/AuthStore';
import { LoginRequest } from 'common';


const { mapState, mapGetters, mapActions, mapMutations } = createNamespacedHelpers<IAuthStore>('auth');
const authActions = mapActions(['load', 'register', 'login', 'logout']);
const authState = mapState(['auth', 'loginFailures', 'loginLoading']);


export default Vue.extend({
  components: {
    VFailures: Failures
  },
  data: () => ({
    loginRequest: {
      id: '',
      password: ''
    } as LoginRequest
  }),
  computed: {
    ...authState
  },
  async mounted () {
    await this.load();
  },
  methods: {
    ...authActions
  }
});
</script>