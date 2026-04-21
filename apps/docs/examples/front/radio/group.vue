<template>
  <xyu-radio-group v-model="value">
    <xyu-radio value="1">选项一</xyu-radio>
    <xyu-radio value="2">选项二</xyu-radio>
    <xyu-radio value="3">选项三</xyu-radio>
  </xyu-radio-group>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const value = ref('1');
</script>
