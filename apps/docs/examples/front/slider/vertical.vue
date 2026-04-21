<template>
  <xyu-slider v-model="value" vertical height="200px" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const value = ref(0);
</script>
