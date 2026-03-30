<script setup lang="ts">
import { ref } from "vue";
import type { TableInstance } from "xiaoye-components";

interface Row {
  id: number;
  name: string;
  owner: string;
  status: "启用" | "排期中";
  score: number;
}

const tableRef = ref<TableInstance<Row>>();
const rows: Row[] = [
  { id: 1, name: "Billing Console", owner: "Xiaoye", status: "启用", score: 96 },
  { id: 2, name: "Sales Admin", owner: "Alice", status: "排期中", score: 88 },
  { id: 3, name: "Ops Portal", owner: "Jason", status: "启用", score: 92 }
];
</script>

<template>
  <div class="xy-doc-stack xy-table-doc-scene">
    <div class="xy-table-doc-toolbar">
      <div class="xy-table-doc-toolbar__group">
        <div class="xy-table-doc-toolbar__chip">
          <span>组合能力</span>
          <strong>selection / expand / summary</strong>
        </div>
      </div>

      <xy-space wrap>
        <xy-button text size="sm" @click="tableRef?.toggleAllSelection()">全选当前页</xy-button>
        <xy-button text size="sm" @click="tableRef?.clearSelection()">清空选择</xy-button>
        <xy-button text size="sm" @click="tableRef?.clearSort()">清空排序</xy-button>
      </xy-space>
    </div>

    <div class="xy-table-doc-scene__surface">
      <xy-table
        ref="tableRef"
        :data="rows"
        row-key="id"
        stripe
        border
        show-summary
        sum-text="总计"
      >
        <xy-table-column type="selection" fixed="left" />
        <xy-table-column type="index" label="#" width="64" fixed="left" />
        <xy-table-column type="expand" width="60">
          <template #default="{ row }">
            <div class="table-demo-expanded">
              <div class="table-demo-expanded__title">{{ row.name }}</div>
              <div class="table-demo-expanded__meta">负责人：{{ row.owner }}</div>
            </div>
          </template>
        </xy-table-column>
        <xy-table-column prop="name" label="项目名称" min-width="200" sortable show-overflow-tooltip />
        <xy-table-column prop="owner" label="负责人" min-width="140" />
        <xy-table-column prop="status" label="状态" min-width="120">
          <template #default="{ value }">
            <xy-tag :status="value === '启用' ? 'success' : 'warning'">{{ value }}</xy-tag>
          </template>
        </xy-table-column>
        <xy-table-column
          prop="score"
          label="健康度"
          align="right"
          sortable
          min-width="120"
          fixed="right"
        />
      </xy-table>
    </div>
  </div>
</template>

<style scoped>
.table-demo-expanded {
  display: grid;
  gap: 4px;
}

.table-demo-expanded__title {
  color: #303133;
  font-size: 14px;
  font-weight: 600;
}

.table-demo-expanded__meta {
  color: #606266;
  font-size: 13px;
  line-height: 1.6;
}
</style>
