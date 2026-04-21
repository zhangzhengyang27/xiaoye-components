<template>
  <xyu-slider v-model="value" disabled />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const value = ref(0);
</script>
