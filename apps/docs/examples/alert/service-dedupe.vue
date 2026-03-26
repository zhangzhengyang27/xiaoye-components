<script setup lang="ts">
import { ref } from "vue";
import { XyAlertService } from "xiaoye-components";

const syncCount = ref(0);

function pushSyncAlert() {
  syncCount.value += 1;

  XyAlertService.open({
    groupKey: "sync-progress",
    title: `同步状态第 ${syncCount.value} 次刷新`,
    description: "同一个 groupKey 不会重复入队，而是直接更新当前横幅的文案、状态和时长。",
    type: syncCount.value % 2 === 0 ? "success" : "warning",
    duration: 2200,
    showIcon: true
  });
}
</script>

<template>
  <xy-space wrap>
    <xy-button type="primary" @click="pushSyncAlert">重复触发同一提醒</xy-button>
    <xy-tag round status="primary">已触发：{{ syncCount }}</xy-tag>
  </xy-space>
</template>
