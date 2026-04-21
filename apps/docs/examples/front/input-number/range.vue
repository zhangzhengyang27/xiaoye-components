<template>
  <xyu-input-number v-model="value" :min="0" :max="100" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const value = ref(50);
</script>
