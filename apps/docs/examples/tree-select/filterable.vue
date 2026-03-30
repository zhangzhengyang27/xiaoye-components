<script setup lang="ts">
import { ref } from "vue";

const value = ref<number | null>(null);
const data = [
  {
    id: 1,
    label: "工作台",
    children: [{ id: 11, label: "账单中心" }]
  },
  {
    id: 2,
    label: "配置中心"
  }
];
</script>

<template>
  <xy-tree-select
    v-model="value"
    :data="data"
    node-key="id"
    filterable
    clearable
    search-placeholder="搜索节点"
  />
</template>
