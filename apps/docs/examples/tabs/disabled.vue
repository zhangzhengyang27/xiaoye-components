<script setup lang="ts">
const items = [
  { key: "all", label: "全部" },
  { key: "pending", label: "待处理" },
  { key: "archived", label: "已归档", disabled: true }
];
</script>

<template>
  <xy-tabs :items="items">
    <template #default="{ activeKey }">
      <div class="demo-panel demo-panel--short">当前页签：{{ activeKey }}</div>
    </template>
  </xy-tabs>
</template>
