<template>
  <xyu-slider v-model="value" :step="10" show-stops />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const value = ref(0);
</script>
