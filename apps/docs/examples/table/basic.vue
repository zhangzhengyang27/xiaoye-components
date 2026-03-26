<script setup lang="ts">
import { ref } from "vue";

const activeRowId = ref<number | null>(null);
const rows = [
  { id: 1, name: "Billing Console", owner: "Xiaoye", status: "开发中" },
  { id: 2, name: "Sales Admin", owner: "Alice", status: "已上线" }
];

function rowClassName(row: { id: number }) {
  return row.id === activeRowId.value ? "doc-row-active" : "";
}

function handleRowClick(row: { id: number }) {
  activeRowId.value = row.id;
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-table
      :data="rows"
      row-key="id"
      stripe
      :row-class-name="rowClassName"
      highlight-current-row
      clickable
      @row-click="handleRowClick"
    >
      <xy-table-column prop="name" label="项目名称" show-overflow-tooltip />
      <xy-table-column prop="owner" label="负责人" />
      <xy-table-column prop="status" label="状态">
        <template #default="{ value }">
          <xy-tag :status="value === '已上线' ? 'success' : 'warning'">{{ value }}</xy-tag>
        </template>
      </xy-table-column>
    </xy-table>

    <xy-tag :status="activeRowId ? 'success' : 'neutral'">当前行：{{ activeRowId ?? "未选择" }}</xy-tag>
  </div>
</template>
