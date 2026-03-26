<script setup lang="ts">
const data = [
  {
    id: 1,
    label: "控制台",
    children: [
      { id: 11, label: "总览看板" },
      { id: 12, label: "账单中心" }
    ]
  },
  {
    id: 2,
    label: "审批中心",
    children: [
      { id: 21, label: "待处理" },
      { id: 22, label: "已完成" }
    ]
  }
];
</script>

<template>
  <div class="xy-doc-field">
    <xy-tree
      :data="data"
      node-key="id"
      highlight-current
      default-expand-all
    />
  </div>
</template>
