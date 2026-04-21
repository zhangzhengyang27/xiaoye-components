<script setup lang="ts">
import { ref } from "vue";

const current = ref<string | number | null>("dashboard");

const options = [
  {
    value: "dashboard",
    title: "工作台",
    description: "适合承接首页入口、汇总指标和待办概览。",
    avatar: {
      text: "台",
      shape: "square"
    },
    tag: {
      text: "推荐",
      props: {
        status: "primary",
        round: true
      }
    }
  },
  {
    value: "report",
    title: "报表中心",
    description: "更适合经营分析、趋势对比和导出任务视图。",
    avatar: {
      text: "报",
      shape: "square"
    }
  }
];
</script>

<template>
  <div class="demo-check-card-group">
    <xy-check-card-group v-model="current" :options="options" />

    <xy-tag round>当前选择：{{ current || "未选择" }}</xy-tag>
  </div>
</template>

<style scoped>
.demo-check-card-group {
  display: grid;
  gap: 16px;
}
</style>
