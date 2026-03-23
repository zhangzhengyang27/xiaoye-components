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
      :columns="[
        { key: 'name', title: '项目名称', dataIndex: 'name' },
        { key: 'owner', title: '负责人', dataIndex: 'owner' },
        { key: 'status', title: '状态', dataIndex: 'status', slot: 'status' }
      ]"
      :data="rows"
      row-key="id"
      :row-class-name="rowClassName"
      clickable
      @row-click="handleRowClick"
    >
      <template #cell-status="{ value }">
        <xy-tag :status="value === '已上线' ? 'success' : 'warning'">{{ value }}</xy-tag>
      </template>
    </xy-table>

    <xy-tag :status="activeRowId ? 'success' : 'neutral'">当前行：{{ activeRowId ?? "未选择" }}</xy-tag>
  </div>
</template>
