<script setup lang="ts">
import { computed, ref, watch } from "vue";

const loading = ref(false);
const showEmpty = ref(false);
const activeRowId = ref<number | null>(null);
type DemoRow = {
  id: number;
  name: string;
  owner: string;
  status: string;
};

const rows: DemoRow[] = [
  { id: 101, name: "Billing Console", owner: "Xiaoye", status: "开发中" },
  { id: 102, name: "Sales Admin", owner: "Alice", status: "已上线" },
  { id: 103, name: "Support Hub", owner: "Bob", status: "设计中" }
];

const displayRows = computed(() => (showEmpty.value ? [] : rows));
const activeRow = computed(() => displayRows.value.find((row) => row.id === activeRowId.value) ?? null);

watch(showEmpty, (value) => {
  if (value) {
    activeRowId.value = null;
  }
});

function resolveClickedRow(target: EventTarget | null) {
  const rowElement = target instanceof HTMLElement ? target.closest("tbody tr") : null;
  const rowText = rowElement?.textContent?.replace(/\s+/g, " ").trim();

  if (!rowText) {
    return null;
  }

  return displayRows.value.find((row) => rowText.includes(row.name) && rowText.includes(row.owner)) ?? null;
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
    <xy-space wrap>
      <xy-button plain @click="loading = !loading">{{ loading ? "关闭加载态" : "开启加载态" }}</xy-button>
      <xy-button plain @click="showEmpty = !showEmpty">{{ showEmpty ? "恢复数据" : "查看空态" }}</xy-button>
      <xy-tag :status="activeRow ? 'success' : 'neutral'">
        当前行：{{ activeRow ? `${activeRow.name} / ${activeRow.owner} / ${activeRow.status}` : "未选择" }}
      </xy-tag>
    </xy-space>

    <div @click.capture="handleTableClick">
      <xy-table
        v-model:current-row-key="activeRowId"
        :data="displayRows"
        :loading="loading"
        loading-text="正在加载项目列表"
        row-key="id"
        :row-class-name="rowClassName"
        highlight-current-row
        clickable
      >
        <xy-table-column prop="name" label="项目名称" />
        <xy-table-column prop="owner" label="负责人" />
        <xy-table-column prop="status" label="状态">
          <template #default="{ value }">
            <xy-tag :status="value === '已上线' ? 'success' : 'warning'">{{ value }}</xy-tag>
          </template>
        </xy-table-column>
        <template #loading>
          正在同步项目数据，请稍候...
        </template>
        <template #empty>
          <xy-empty title="暂无项目" description="当前筛选条件没有返回结果">
            <xy-button plain @click="showEmpty = false">恢复数据</xy-button>
          </xy-empty>
        </template>
      </xy-table>
    </div>

    <xy-pagination :total="86" />
  </div>
</template>
