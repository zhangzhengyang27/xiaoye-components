<script setup lang="ts">
import { ref } from "vue";

const keyword = ref("");
const options = [
  { label: "控制台", value: 1 },
  { label: "账单中心", value: 2 },
  { label: "项目配置", value: 3 }
];
</script>

<template>
  <xy-auto-complete v-model="keyword" :options="options" placeholder="搜索模块" clearable />
</template>
