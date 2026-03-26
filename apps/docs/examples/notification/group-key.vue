<script setup lang="ts">
import { ref } from "vue";
import { XyNotificationService } from "xiaoye-components";

const triggerCount = ref(0);

function triggerSameGroup() {
  triggerCount.value += 1;

  XyNotificationService.open({
    groupKey: "inventory-sync",
    title: `库存同步进行中（第 ${triggerCount.value} 次刷新）`,
    message: "重复触发不会新增实例，而是更新同一条通知。",
    duration: 2600,
    type: triggerCount.value % 2 === 0 ? "success" : "info"
  });
}
</script>

<template>
  <xy-space wrap>
    <xy-button type="primary" @click="triggerSameGroup">重复触发同一 groupKey</xy-button>
    <xy-tag round status="primary">已触发：{{ triggerCount }}</xy-tag>
  </xy-space>
</template>
