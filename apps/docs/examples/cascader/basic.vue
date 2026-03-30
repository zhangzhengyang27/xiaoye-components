<script setup lang="ts">
import { ref } from "vue";

const value = ref<Array<string | number> | null>([1, 11]);
const options = [
  {
    value: 1,
    label: "工作台",
    children: [{ value: 11, label: "账单中心" }]
  },
  {
    value: 2,
    label: "配置中心"
  }
];
</script>

<template>
  <xy-cascader v-model="value" :options="options" clearable />
</template>
