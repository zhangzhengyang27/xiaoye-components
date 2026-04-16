<script setup lang="ts">
import { ref } from "vue";
import type { TableInstance, TableSortOrder } from "xiaoye-components";

interface MethodRow {
  id: number;
  name: string;
  owner: string;
  status: "启用" | "停用";
  score: number;
}

const tableRef = ref<TableInstance<MethodRow> | null>(null);
const rows: MethodRow[] = [
  { id: 1, name: "统一权限中心", owner: "小叶", status: "启用", score: 96 },
  { id: 2, name: "结算控制台", owner: "小周", status: "停用", score: 74 },
  { id: 3, name: "投放归因分析", owner: "小叶", status: "启用", score: 88 }
];

const sortMessage = ref("未排序");
const filterMessage = ref("未筛选");
const selectionMessage = ref("未选择");

function handleSortChange(payload: { prop?: string; order?: TableSortOrder }) {
  if (!payload.prop || !payload.order) {
    sortMessage.value = "未排序";
    return;
  }

  sortMessage.value = `${payload.prop} / ${payload.order === "ascending" ? "升序" : "降序"}`;
}

function handleFilterChange(filters: Record<string, Array<string | number | boolean>>) {
  const values = filters.status ?? [];
  filterMessage.value = values.length > 0 ? values.join(" / ") : "未筛选";
}

function handleSelectionChange(selection: MethodRow[]) {
  selectionMessage.value = selection.length > 0 ? selection.map((item) => item.name).join(" / ") : "未选择";
}

function sortByScore() {
  tableRef.value?.sort("score", "descending");
}

function clearSort() {
  tableRef.value?.clearSort();
}

function clearStatusFilter() {
  tableRef.value?.clearFilter("status");
}

function clearAllFilters() {
  tableRef.value?.clearFilter();
}

function toggleAll() {
  tableRef.value?.toggleAllSelection();
}
</script>

<template>
  <div class="xy-doc-stack xy-table-doc-scene">
    <div class="xy-table-doc-toolbar">
      <div class="xy-table-doc-toolbar__group">
        <div class="xy-table-doc-toolbar__chip">
          <span>sort</span>
          <strong>{{ sortMessage }}</strong>
        </div>
        <div class="xy-table-doc-toolbar__chip">
          <span>filter</span>
          <strong>{{ filterMessage }}</strong>
        </div>
        <div class="xy-table-doc-toolbar__chip">
          <span>selection</span>
          <strong>{{ selectionMessage }}</strong>
        </div>
      </div>

      <xy-space wrap>
        <xy-button text size="sm" @click="sortByScore">实例排序</xy-button>
        <xy-button text size="sm" @click="clearSort">清空排序</xy-button>
        <xy-button text size="sm" @click="clearStatusFilter">清空状态筛选</xy-button>
        <xy-button text size="sm" @click="clearAllFilters">清空所有筛选</xy-button>
        <xy-button text size="sm" @click="toggleAll">切换当前可见行全选</xy-button>
      </xy-space>
    </div>

    <div class="xy-table-doc-scene__surface">
      <xy-table
        ref="tableRef"
        :data="rows"
        row-key="id"
        border
        stripe
        @sort-change="handleSortChange"
        @filter-change="handleFilterChange"
        @selection-change="handleSelectionChange"
      >
        <xy-table-column type="selection" width="52" />
        <xy-table-column prop="name" label="模块名称" min-width="180" />
        <xy-table-column prop="owner" label="负责人" width="120" />
        <xy-table-column
          prop="status"
          label="状态"
          width="120"
          column-key="status"
          :filters="[
            { text: '启用', value: '启用' },
            { text: '停用', value: '停用' }
          ]"
        >
          <template #default="{ value }">
            <xy-tag :status="value === '启用' ? 'success' : 'warning'">{{ value }}</xy-tag>
          </template>
        </xy-table-column>
        <xy-table-column prop="score" label="健康度" width="120" align="right" sortable />
      </xy-table>
    </div>
  </div>
</template>
