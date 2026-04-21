<template>
  <xyu-checkbox-group v-model="checked" :options="options" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const checked = ref(['1']);
const options = [
  { label: '选项一', value: '1' },
  { label: '选项二', value: '2' },
  { label: '选项三', value: '3' },
];
</script>
