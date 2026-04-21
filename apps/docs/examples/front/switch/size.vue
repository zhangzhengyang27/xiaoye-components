<template>
  <xyu-space direction="vertical">
    <xyu-switch v-model="value" size="sm" />
    <xyu-switch v-model="value" size="md" />
    <xyu-switch v-model="value" size="lg" />
  </xyu-space>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const value = ref(false);
</script>
