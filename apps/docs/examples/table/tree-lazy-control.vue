<script setup lang="ts">
import { ref } from "vue";
import type { TableInstance } from "xiaoye-components";

interface TreeRow {
  id: number;
  name: string;
  owner: string;
  score: number;
  hasChildren?: boolean;
}

const tableRef = ref<TableInstance<TreeRow> | null>(null);
const rows = ref<TreeRow[]>([
  { id: 1, name: "基础平台", owner: "小叶", score: 96, hasChildren: true },
  { id: 2, name: "增长中台", owner: "小周", score: 88, hasChildren: true }
]);
const pendingKeys = ref<number[]>([]);

function load(row: TreeRow, _treeNode: unknown, resolve: (rows: TreeRow[]) => void) {
  pendingKeys.value = [...new Set([...pendingKeys.value, row.id])];

  window.setTimeout(() => {
    pendingKeys.value = pendingKeys.value.filter((key) => key !== row.id);
    resolve([
      {
        id: row.id * 10 + 1,
        name: `${row.name} / 延迟子节点`,
        owner: "Momo",
        score: 82
      }
    ]);
  }, 700);
}

function injectChildren() {
  tableRef.value?.updateKeyChildren(2, [
    {
      id: 21,
      name: "增长中台 / 手动写回子节点",
      owner: "Nina",
      score: 85
    }
  ]);
  pendingKeys.value = pendingKeys.value.filter((key) => key !== 2);
}
</script>

<template>
  <div class="xy-doc-stack xy-table-doc-scene">
    <div class="xy-table-doc-toolbar">
      <div class="xy-table-doc-toolbar__group">
        <div class="xy-table-doc-toolbar__chip">
          <span>lazy</span>
          <strong>{{ pendingKeys.length > 0 ? `loading ${pendingKeys.join(", ")}` : "idle" }}</strong>
        </div>
        <div class="xy-table-doc-toolbar__chip">
          <span>updateKeyChildren</span>
          <strong>manual hydrate</strong>
        </div>
      </div>

      <xy-button text size="sm" @click="injectChildren">手动写回增长中台 children</xy-button>
    </div>

    <div class="xy-table-doc-scene__surface">
      <xy-table
        ref="tableRef"
        :data="rows"
        row-key="id"
        border
        lazy
        :load="load"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <xy-table-column prop="name" label="模块名称" min-width="220" />
        <xy-table-column prop="owner" label="负责人" width="120" />
        <xy-table-column prop="score" label="健康度" width="120" align="right" />
      </xy-table>
    </div>

    <div class="xy-table-doc-scene__footer">
      <div class="xy-table-doc-scene__summary">
        <div class="xy-table-doc-scene__label">Behavior</div>
        <div class="xy-table-doc-scene__value">
          lazy 节点加载中会进入稳定 loading 态；如果业务侧提前拿到 children，可以直接通过 updateKeyChildren 写回并结束 loading。
        </div>
      </div>
    </div>
  </div>
</template>
