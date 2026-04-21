<template>
  <xyu-switch
    v-model="value"
    :active-value="1"
    :inactive-value="0"
    active-text="开"
    inactive-text="关"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const value = ref(0);
</script>
