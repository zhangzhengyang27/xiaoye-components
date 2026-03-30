<script setup lang="ts">
const tasks = [
  {
    id: 1,
    name: "华东供应商账单导出",
    status: "processing" as const,
    progress: 64,
    createdAt: "2026-03-29 09:30"
  },
  {
    id: 2,
    name: "成员权限矩阵归档",
    status: "success" as const,
    progress: 100,
    createdAt: "2026-03-29 08:10"
  },
  {
    id: 3,
    name: "审批日志追溯包",
    status: "error" as const,
    createdAt: "2026-03-29 07:20"
  }
];
</script>

<template>
  <div class="xy-pro-demo-stack">
    <xy-card header="导出中心">
      <p>运营台和财务台通常会把导出任务集中沉淀到一个任务中心，而不是让下载动作散落在列表按钮上。</p>
    </xy-card>
    <xy-export-task-panel title="导出任务" :tasks="tasks" />
  </div>
</template>
