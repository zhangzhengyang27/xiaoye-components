<script setup lang="ts">
import { computed, ref } from "vue";

const loading = ref(false);
const showEmpty = ref(false);
const activeRowId = ref<number | null>(null);
const rows = [
  { id: 101, name: "Billing Console", owner: "Xiaoye", status: "开发中" },
  { id: 102, name: "Sales Admin", owner: "Alice", status: "已上线" },
  { id: 103, name: "Support Hub", owner: "Bob", status: "设计中" }
];

const displayRows = computed(() => (showEmpty.value ? [] : rows));

function handleRowClick(row: { id: number }) {
  activeRowId.value = row.id;
}

function rowClassName(row: { id: number }) {
  return row.id === activeRowId.value ? "doc-row-active" : "";
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-button plain @click="loading = !loading">{{ loading ? "关闭加载态" : "开启加载态" }}</xy-button>
      <xy-button plain @click="showEmpty = !showEmpty">{{ showEmpty ? "恢复数据" : "查看空态" }}</xy-button>
      <xy-tag :status="activeRowId ? 'success' : 'neutral'">当前行：{{ activeRowId ?? "未选择" }}</xy-tag>
    </xy-space>

    <xy-table
      :data="displayRows"
      :loading="loading"
      loading-text="正在加载项目列表"
      row-key="id"
      :row-class-name="rowClassName"
      highlight-current-row
      clickable
      @row-click="handleRowClick"
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

    <xy-pagination :total="86" />
  </div>
</template>
