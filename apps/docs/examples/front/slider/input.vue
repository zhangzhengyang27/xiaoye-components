<template>
  <xyu-slider v-model="value" show-input />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const value = ref(0);
</script>
