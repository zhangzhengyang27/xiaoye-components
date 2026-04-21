<template>
  <xyu-input-number v-model="value" controls-position="right" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const value = ref(0);
</script>
