<template>
  <xyu-date-picker v-model="value" placeholder="选择日期" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const value = ref('');
</script>
