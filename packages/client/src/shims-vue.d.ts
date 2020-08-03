import { Store } from 'vuex-typescript-interface';

declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare module "vue/types/options" {
  interface ComponentOptions<V extends Vue> {
    store?: Store<any>;
  }
}

declare module "vue/types/vue" {
  interface Vue {
    $store: Store<any>;
  }
}