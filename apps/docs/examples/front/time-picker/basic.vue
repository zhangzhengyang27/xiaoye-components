<template>
  <xyu-time-picker v-model="value" placeholder="选择时间" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const value = ref('');
</script>
