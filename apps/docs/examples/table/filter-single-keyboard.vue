<script setup lang="ts">
import { ref } from "vue";

interface TaskRow {
  id: number;
  module: string;
  owner: string;
  priority: "高" | "中" | "低";
}

const rows = ref<TaskRow[]>([
  { id: 1, module: "订单拆单", owner: "Xiaoye", priority: "高" },
  { id: 2, module: "发票同步", owner: "Alice", priority: "中" },
  { id: 3, module: "履约回传", owner: "Jason", priority: "低" },
  { id: 4, module: "退款审核", owner: "Luna", priority: "高" }
]);
const selectedPriority = ref("全部优先级");

function handleFilterChange(filters: Record<string, Array<string | number | boolean>>) {
  const priority = filters.priority?.[0];
  selectedPriority.value = typeof priority === "string" ? priority : "全部优先级";
}
</script>

<template>
  <div class="xy-doc-stack xy-table-doc-scene">
    <div class="xy-table-doc-toolbar">
      <div class="xy-table-doc-toolbar__group">
        <div class="xy-table-doc-toolbar__chip">
          <span>当前筛选</span>
          <strong>{{ selectedPriority }}</strong>
        </div>
        <div class="xy-table-doc-toolbar__chip">
          <span>键盘切换</span>
          <strong>方向键支持</strong>
        </div>
        <div class="xy-table-doc-toolbar__chip">
          <span>确认关闭</span>
          <strong>回车确认 / Tab 关闭</strong>
        </div>
      </div>
    </div>

    <div class="xy-table-doc-scene__surface">
      <xy-table :data="rows" row-key="id" border @filter-change="handleFilterChange">
        <xy-table-column prop="module" label="模块" min-width="180" />
        <xy-table-column prop="owner" label="负责人" width="120" />
        <xy-table-column
          prop="priority"
          label="优先级"
          width="110"
          column-key="priority"
          :filter-multiple="false"
          :filters="[
            { text: '高', value: '高' },
            { text: '中', value: '中' },
            { text: '低', value: '低' }
          ]"
        >
          <template #default="{ value }">
            <xy-tag :status="value === '高' ? 'danger' : value === '中' ? 'warning' : 'neutral'">
              {{ value }}
            </xy-tag>
          </template>
        </xy-table-column>
      </xy-table>
    </div>
  </div>
</template>
