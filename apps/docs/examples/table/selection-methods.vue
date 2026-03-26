<script setup lang="ts">
import { ref } from "vue";
import type { TableInstance } from "xiaoye-components";

interface MemberRow {
  id: number;
  name: string;
  role: string;
  score: number;
  status: "在线" | "离线";
}

const tableRef = ref<TableInstance<MemberRow> | null>(null);
const selectedNames = ref<string[]>([]);
const rows: MemberRow[] = [
  { id: 1, name: "赵清和", role: "运营负责人", score: 96, status: "在线" },
  { id: 2, name: "沈知言", role: "交付经理", score: 89, status: "在线" },
  { id: 3, name: "林见山", role: "财务审核", score: 78, status: "离线" }
];

function handleSelectionChange(selection: MemberRow[]) {
  selectedNames.value = selection.map((item) => item.name);
}

function selectFirstRow() {
  tableRef.value?.toggleRowSelection(rows[0], true);
}

function clearSelection() {
  tableRef.value?.clearSelection();
}

function sortByScore() {
  tableRef.value?.sort("score", "descending");
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-button plain @click="selectFirstRow">选中第一行</xy-button>
      <xy-button plain @click="sortByScore">按健康度降序</xy-button>
      <xy-button plain @click="clearSelection">清空选择</xy-button>
      <xy-tag status="primary">已选：{{ selectedNames.join(" / ") || "无" }}</xy-tag>
    </xy-space>

    <xy-table
      ref="tableRef"
      :data="rows"
      row-key="id"
      stripe
      border
      @selection-change="handleSelectionChange"
    >
      <xy-table-column type="selection" width="52" />
      <xy-table-column type="index" width="64" label="#" />
      <xy-table-column prop="name" label="姓名" />
      <xy-table-column prop="role" label="角色" show-overflow-tooltip />
      <xy-table-column prop="score" label="健康度" align="right" sortable />
      <xy-table-column prop="status" label="状态">
        <template #default="{ value }">
          <xy-tag :status="value === '在线' ? 'success' : 'neutral'">{{ value }}</xy-tag>
        </template>
      </xy-table-column>
    </xy-table>
  </div>
</template>
