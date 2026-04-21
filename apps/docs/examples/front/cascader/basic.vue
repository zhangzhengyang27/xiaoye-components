<template>
  <xyu-space direction="vertical" style="width: 200px">
    <xyu-cascader
      v-model="value"
      :options="options"
      placeholder="请选择"
    />
  </xyu-space>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const value = ref('');
const options = [
  {
    value: 'zhejiang',
    label: '浙江',
    children: [
      { value: 'hangzhou', label: '杭州' },
      { value: 'ningbo', label: '宁波' },
    ],
  },
  {
    value: 'jiangsu',
    label: '江苏',
    children: [
      { value: 'nanjing', label: '南京' },
      { value: 'suzhou', label: '苏州' },
    ],
  },
];
</script>
