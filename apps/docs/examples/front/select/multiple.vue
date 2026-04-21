<template>
  <xyu-select
    v-model="value"
    :options="options"
    placeholder="请选择"
    multiple
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const value = ref<string[]>([]);
const options = [
  { label: '选项一', value: '1' },
  { label: '选项二', value: '2' },
  { label: '选项三', value: '3' },
  { label: '选项四', value: '4' },
];
</script>
