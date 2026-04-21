<template>
  <xyu-color-picker v-model="color" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const color = ref('#6264f0');
</script>
