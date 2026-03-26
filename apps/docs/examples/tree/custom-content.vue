<script setup lang="ts">
const data = [
  {
    id: 1,
    label: "Billing Console",
    owner: "财务",
    state: "stable",
    children: [
      { id: 11, label: "账单配置", owner: "财务", state: "draft" },
      { id: 12, label: "结算模板", owner: "财务", state: "stable" }
    ]
  },
  {
    id: 2,
    label: "Review Center",
    owner: "运营",
    state: "risk"
  }
];

function resolveType(state: string) {
  if (state === "risk") {
    return "danger";
  }

  if (state === "draft") {
    return "warning";
  }

  return "success";
}
</script>

<template>
  <div class="xy-doc-field">
    <xy-tree
      :data="data"
      node-key="id"
      default-expand-all
    >
      <template #default="{ data: node }">
        <div class="demo-tree-node">
          <div class="demo-tree-node__main">
            <strong>{{ node.label }}</strong>
            <small>{{ node.owner }}</small>
          </div>
          <xy-tag size="sm" :type="resolveType(node.state)">
            {{ node.state }}
          </xy-tag>
        </div>
      </template>
    </xy-tree>
  </div>
</template>

<style scoped>
.demo-tree-node {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  min-width: 0;
}

.demo-tree-node__main {
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: 2px;
}

.demo-tree-node__main small {
  color: var(--xy-text-color-secondary);
}
</style>
