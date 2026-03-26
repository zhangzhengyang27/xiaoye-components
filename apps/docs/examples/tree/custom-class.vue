<script setup lang="ts">
const data = [
  {
    id: 1,
    label: "结算系统",
    children: [
      { id: 11, label: "账单中心" },
      { id: 12, label: "资金对账" }
    ]
  },
  {
    id: 2,
    label: "审批系统",
    children: [
      { id: 21, label: "规则配置" },
      { id: 22, label: "流程发布" }
    ]
  }
];

function resolveNodeClass(item: { id: number }) {
  if (item.id === 12) {
    return "is-key-node";
  }

  if (item.id === 2) {
    return {
      "is-branch-node": true
    };
  }

  return "";
}
</script>

<template>
  <div class="xy-doc-field">
    <xy-tree
      :data="data"
      node-key="id"
      default-expand-all
      :props="{ class: resolveNodeClass }"
    />
  </div>
</template>

<style scoped>
:deep(.is-key-node > .xy-tree__node-content) {
  border-color: color-mix(in srgb, var(--xy-color-warning) 34%, var(--xy-border-color));
  background: color-mix(in srgb, var(--xy-color-warning) 8%, var(--xy-bg-color));
}

:deep(.is-branch-node > .xy-tree__node-content) {
  font-weight: 600;
}
</style>
