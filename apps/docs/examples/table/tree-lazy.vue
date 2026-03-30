<script setup lang="ts">
import { ref } from "vue";
import type { TableInstance } from "xiaoye-components";

interface TreeRow {
  id: number;
  name: string;
  owner: string;
  score: number;
  hasChildren?: boolean;
  children?: TreeRow[];
}

const tableRef = ref<TableInstance<TreeRow> | null>(null);
const rows = ref<TreeRow[]>([
  {
    id: 1,
    name: "基础平台",
    owner: "Xiaoye",
    score: 96,
    children: [
      {
        id: 11,
        name: "权限中心",
        owner: "Alice",
        score: 92
      }
    ]
  },
  {
    id: 2,
    name: "增长中台",
    owner: "Jason",
    score: 88,
    hasChildren: true
  }
]);

function load(row: TreeRow, _treeNode: unknown, resolve: (rows: TreeRow[]) => void) {
  window.setTimeout(() => {
    resolve([
      {
        id: row.id * 10 + 1,
        name: `${row.name} / 懒加载子节点`,
        owner: "Momo",
        score: 84
      }
    ]);
  }, 320);
}

function spanMethod({
  row,
  rowIndex,
  columnIndex
}: {
  row: TreeRow;
  rowIndex: number;
  columnIndex: number;
}) {
  if (row.id === 11 && rowIndex === 1 && columnIndex === 0) {
    return [1, 2];
  }

  if (row.id === 11 && rowIndex === 1 && columnIndex === 1) {
    return [0, 0];
  }

  return [1, 1];
}

function injectGrowthChildren() {
  tableRef.value?.updateKeyChildren(2, [
    {
      id: 21,
      name: "增长中台 / 手动注入子节点",
      owner: "Nina",
      score: 86
    }
  ]);
}

function toggleExpandDetail() {
  tableRef.value?.toggleRowExpansion(rows.value[0], undefined);
}
</script>

<template>
  <div class="xy-doc-stack xy-table-doc-scene">
    <div class="xy-table-doc-toolbar">
      <div class="xy-table-doc-toolbar__group">
        <div class="xy-table-doc-toolbar__chip">
          <span>lazy</span>
          <strong>load children</strong>
        </div>
        <div class="xy-table-doc-toolbar__chip">
          <span>tree</span>
          <strong>nested rows</strong>
        </div>
        <div class="xy-table-doc-toolbar__chip">
          <span>preserve</span>
          <strong>expanded dom</strong>
        </div>
      </div>

      <div class="xy-doc-inline-actions">
        <xy-button size="sm" @click="injectGrowthChildren">updateKeyChildren 注入子节点</xy-button>
        <xy-button size="sm" variant="secondary" @click="toggleExpandDetail">
          切换首行详情区
        </xy-button>
      </div>
    </div>

    <div class="xy-table-doc-scene__surface">
      <xy-table
        ref="tableRef"
        :data="rows"
        row-key="id"
        border
        default-expand-all
        lazy
        preserve-expanded-content
        :load="load"
        :span-method="spanMethod"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <xy-table-column type="expand">
          <template #default="{ row }">
            <div class="table-tree-note">
              <div class="table-tree-note__eyebrow">{{ row.name }}</div>
              <div class="table-tree-note__text">
                详情区在折叠后不会销毁，再次展开时会直接复用当前内容。
              </div>
            </div>
          </template>
        </xy-table-column>
        <xy-table-column label="资源信息">
          <xy-table-column prop="name" label="模块名称" min-width="180" />
          <xy-table-column prop="owner" label="负责人" min-width="120" />
        </xy-table-column>
        <xy-table-column prop="score" label="健康度" align="right" width="90" />
      </xy-table>
    </div>
  </div>
</template>

<style scoped>
.table-tree-note {
  display: grid;
  gap: 6px;
}

.table-tree-note__eyebrow {
  color: #409eff;
  font-size: 12px;
  font-weight: 600;
}

.table-tree-note__text {
  color: #606266;
  font-size: 13px;
  line-height: 1.7;
}
</style>
