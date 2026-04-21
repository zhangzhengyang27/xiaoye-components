<template>
  <xyu-rate v-model="value" show-text />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const value = ref(3);
</script>
