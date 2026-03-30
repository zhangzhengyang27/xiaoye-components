<script setup lang="ts">
import { computed, ref } from "vue";

type DemoRow = {
  id: number;
  name: string;
  owner: string;
  status: string;
};

const rows: DemoRow[] = [
  { id: 1, name: "Billing Console", owner: "Xiaoye", status: "开发中" },
  { id: 2, name: "Sales Admin", owner: "Alice", status: "已上线" }
];
const activeRowId = ref<number | null>(rows[0]?.id ?? null);

const activeRow = computed(() => rows.find((row) => row.id === activeRowId.value) ?? null);
const releasedCount = computed(() => rows.filter((row) => row.status === "已上线").length);

function rowClassName(row: DemoRow) {
  return row.id === activeRowId.value ? "doc-row-active" : "";
}

function handleRowClick(row: DemoRow) {
  activeRowId.value = row.id;
}
</script>

<template>
  <div class="xy-doc-stack xy-table-doc-scene">
    <div class="xy-table-doc-scene__hero">
      <div class="xy-table-doc-scene__intro">
        <div class="xy-table-doc-scene__eyebrow">Interactive List</div>
        <div class="xy-table-doc-scene__title">项目交付列表</div>
        <p class="xy-table-doc-scene__description">
          点击任意一行切换当前焦点，让基础表格也能保留后台列表该有的层级和主状态。
        </p>
      </div>

      <div class="xy-table-doc-scene__meta">
        <div class="xy-table-doc-chip">
          <span>项目数</span>
          <strong>{{ rows.length }}</strong>
        </div>
        <div class="xy-table-doc-chip">
          <span>已上线</span>
          <strong>{{ releasedCount }}</strong>
        </div>
        <div class="xy-table-doc-chip">
          <span>交互模式</span>
          <strong>Current Row</strong>
        </div>
      </div>
    </div>

    <div class="xy-table-doc-scene__surface">
      <xy-table
        v-model:current-row-key="activeRowId"
        :data="rows"
        row-key="id"
        border
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
    </div>

    <div class="xy-table-doc-scene__footer">
      <div class="xy-table-doc-scene__summary">
        <div class="xy-table-doc-scene__label">Current Focus</div>
        <div class="xy-table-doc-scene__value">
          {{
            activeRow ? `${activeRow.name} / ${activeRow.owner} / ${activeRow.status}` : "未选择"
          }}
        </div>
      </div>

      <xy-tag :status="activeRow?.status === '已上线' ? 'success' : 'warning'">
        {{ activeRow?.status === "已上线" ? "已进入稳定项目" : "当前焦点待发布" }}
      </xy-tag>
    </div>
  </div>
</template>
