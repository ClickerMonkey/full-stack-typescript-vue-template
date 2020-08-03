import Vue from 'vue';
import Vuex from 'vuex-typescript-interface';

import { IRootStore } from './stores/RootStore';
import { auth } from './stores/AuthStore';

Vue.use(Vuex);

export default new Vuex.Store<IRootStore>({
  modules: {
    auth
  }
});
