<script setup lang="ts">
import { computed, ref } from "vue";

type DemoRow = {
  id: number;
  name: string;
  owner: string;
  status: string;
};

const activeRowId = ref<number | null>(null);
const rows: DemoRow[] = [
  { id: 1, name: "Billing Console", owner: "Xiaoye", status: "开发中" },
  { id: 2, name: "Sales Admin", owner: "Alice", status: "已上线" }
];

const activeRow = computed(() => rows.find((row) => row.id === activeRowId.value) ?? null);

function resolveClickedRow(target: EventTarget | null) {
  const rowElement = target instanceof HTMLElement ? target.closest("tbody tr") : null;
  const rowText = rowElement?.textContent?.replace(/\s+/g, " ").trim();

  if (!rowText) {
    return null;
  }

  return rows.find((row) => rowText.includes(row.name) && rowText.includes(row.owner)) ?? null;
}

function rowClassName(row: DemoRow) {
  return row.id === activeRowId.value ? "doc-row-active" : "";
}

function handleTableClick(event: MouseEvent) {
  const row = resolveClickedRow(event.target);

  if (!row) {
    return;
  }

  activeRowId.value = row.id;
}
</script>

<template>
  <div class="xy-doc-stack">
    <div @click.capture="handleTableClick">
      <xy-table
        v-model:current-row-key="activeRowId"
        :data="rows"
        row-key="id"
        stripe
        :row-class-name="rowClassName"
        highlight-current-row
        clickable
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

    <xy-tag :status="activeRow ? 'success' : 'neutral'">
      当前行：{{ activeRow ? `${activeRow.name} / ${activeRow.owner} / ${activeRow.status}` : "未选择" }}
    </xy-tag>
  </div>
</template>
