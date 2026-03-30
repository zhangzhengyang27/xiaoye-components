<script setup lang="ts">
import { ref } from "vue";

const value = ref([2]);
const data = [
  { key: 1, label: "控制台" },
  { key: 2, label: "账单中心", description: "财务相关" },
  { key: 3, label: "配置中心", disabled: true }
];
</script>

<template>
  <xy-transfer v-model="value" :data="data" filterable />
</template>
