<script setup lang="ts">
import { ref } from "vue";

const value = ref<number | null>(11);
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
  <!-- 树形选择器基础用法：展示树形结构的下拉选择 -->
  <div class="demo-tree-select-basic">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-tree-select-basic__header">
          <strong>基础用法</strong>
          <xy-tag status="neutral" round>树形选择</xy-tag>
        </div>
        <p class="demo-tree-select-basic__description">
          树形选择器用于从树形结构中选择节点，支持级联选择。
        </p>
      </template>

      <xy-tree-select v-model="value" :data="data" node-key="id" clearable />
    </xy-card>
  </div>
</template>

<style scoped>
.demo-tree-select-basic {
  max-width: 400px;
}

.demo-tree-select-basic__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-tree-select-basic__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}
</style>
