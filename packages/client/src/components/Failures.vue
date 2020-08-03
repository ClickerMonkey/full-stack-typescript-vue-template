<template>
  <div>
    <div v-if="isString">
      {{ $t(value) }}
    </div>
    <div v-if="isObject">
      <div v-for="(innerValue, key) in value" :key="key">
        {{ $t(innerValue) }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: ['value'],
  computed: {
    isString() {
      return typeof this.value === 'string';
    },
    isObject() {
      return typeof this.value === 'object' && this.value !== null;
    }
  }
});
</script>
