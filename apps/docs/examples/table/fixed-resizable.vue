<script setup lang="ts">
import { ref } from "vue";

const rows = Array.from({ length: 8 }, (_, index) => ({
  id: index + 1,
  name: `项目 ${String(index + 1).padStart(2, "0")}`,
  owner: ["小叶", "Alice", "Jason"][index % 3],
  status: ["研发", "联调", "已上线"][index % 3],
  region: ["华东", "华南", "海外"][index % 3],
  score: 96 - index,
  updatedAt: `2026-03-${String(10 + index).padStart(2, "0")}`
}));
const lastAction = ref("无");
</script>

<template>
  <div class="xy-doc-stack">
    <xy-table :data="rows" row-key="id" border stripe height="320" style="max-width: 100%">
      <xy-table-column fixed="left" prop="name" label="项目名称" width="180" />
      <xy-table-column fixed="left" prop="owner" label="负责人" width="120" />
      <xy-table-column prop="status" label="状态" width="140" />
      <xy-table-column prop="region" label="区域" width="140" />
      <xy-table-column prop="score" label="健康度" align="right" width="140" sortable />
      <xy-table-column prop="updatedAt" label="最近更新" width="180" />
      <xy-table-column fixed="right" label="操作" width="140">
        <template #default="{ row }">
          <xy-button plain @click="lastAction = row.name">查看</xy-button>
        </template>
      </xy-table-column>
    </xy-table>

    <xy-tag status="primary">最近查看：{{ lastAction }}</xy-tag>
  </div>
</template>
