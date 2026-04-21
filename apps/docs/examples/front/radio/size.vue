<template>
  <xyu-radio-group v-model="value">
    <xyu-radio value="1" size="sm">小</xyu-radio>
    <xyu-radio value="2" size="md">中</xyu-radio>
    <xyu-radio value="3" size="lg">大</xyu-radio>
  </xyu-radio-group>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const value = ref('2');
</script>
