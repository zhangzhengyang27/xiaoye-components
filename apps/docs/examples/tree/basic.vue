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
  <!-- 树形控件基础用法：展示可折叠的树形结构 -->
  <div class="demo-tree-basic">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-tree-basic__header">
          <strong>基础用法</strong>
          <xy-tag status="neutral" round>树形结构</xy-tag>
        </div>
        <p class="demo-tree-basic__description">
          树形控件用于展示具有层级关系的数据，支持展开和折叠。
        </p>
      </template>

      <div class="demo-tree-basic__content">
        <xy-tree
          :data="data"
          node-key="id"
          highlight-current
          default-expand-all
        />
      </div>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-tree-basic {
  max-width: 400px;
}

.demo-tree-basic__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-tree-basic__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}

.demo-tree-basic__content {
  padding: 12px;
  border: 1px solid var(--xy-border-color-subtle);
  border-radius: 12px;
  background: var(--xy-bg-color-subtle);
}
</style>
