<template>
  <xyu-select
    v-model="value"
    :options="options"
    placeholder="禁用状态"
    disabled
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const value = ref('');
const options = [
  { label: '选项一', value: '1' },
  { label: '选项二', value: '2' },
];
</script>
