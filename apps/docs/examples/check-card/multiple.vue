<script setup lang="ts">
import { ref } from "vue";

const selected = ref<Array<string | number>>(["search"]);

const options = [
  {
    value: "search",
    title: "搜索能力",
    description: "查询、筛选和关键字联想。"
  },
  {
    value: "export",
    title: "导出能力",
    description: "导出任务、下载记录和批量文件。"
  },
  {
    value: "audit",
    title: "审计能力",
    description: "操作日志、审批轨迹和差异追踪。"
  }
];
</script>

<template>
  <div class="demo-check-card-multiple">
    <xy-check-card-group v-model="selected" multiple :options="options" />

    <xy-tag status="primary" round>已选：{{ selected.join(" / ") || "无" }}</xy-tag>
  </div>
</template>

<style scoped>
.demo-check-card-multiple {
  display: grid;
  gap: 16px;
}
</style>
