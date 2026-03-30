<script setup lang="ts">
import type { ProTableColumn } from "@xiaoye/pro-components";

interface ImportRow {
  id: number;
  name: string;
  status: "成功" | "失败";
  reason: string;
}

const rows: ImportRow[] = [
  { id: 1, name: "杭州分部", status: "成功", reason: "-" },
  { id: 2, name: "上海分部", status: "失败", reason: "负责人字段缺失" }
];

const columns: ProTableColumn<ImportRow>[] = [
  { prop: "name", label: "记录名称", minWidth: 180 },
  { prop: "status", label: "结果", slot: "status", minWidth: 120 },
  { prop: "reason", label: "说明", minWidth: 200 }
];
</script>

<template>
  <xy-import-result-table
    :data="rows"
    :columns="columns"
    :summary="{ total: 2, success: 1, failed: 1 }"
  >
    <template #status="{ row }">
      <xy-tag :status="row.status === '成功' ? 'success' : 'danger'">
        {{ row.status }}
      </xy-tag>
    </template>
  </xy-import-result-table>
</template>
