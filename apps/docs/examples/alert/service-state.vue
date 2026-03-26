<script setup lang="ts">
import { computed, ref } from "vue";
import { XyAlertService, type AlertServiceSnapshot } from "xiaoye-components";

const seed = ref(0);
const snapshot = ref<AlertServiceSnapshot>(XyAlertService.getState());

const currentTitle = computed(() => snapshot.value.current?.title ?? "无");

function refreshSnapshot() {
  snapshot.value = XyAlertService.getState();
}

function enqueueAlerts() {
  const base = seed.value;

  for (let index = 0; index < 4; index += 1) {
    XyAlertService.open({
      title: `状态任务 #${base + index + 1}`,
      description: "这里把 maxQueue 固定为 2，并通过 getState() 读取当前项和等待队列长度。",
      type: index % 2 === 0 ? "info" : "warning",
      duration: 1800,
      showIcon: true,
      maxQueue: 2,
      overflowStrategy: "drop-oldest",
      onClosed() {
        refreshSnapshot();
      }
    });
  }

  seed.value += 4;
  refreshSnapshot();
}

function closeAll() {
  XyAlertService.closeAll();
  refreshSnapshot();
}
</script>

<template>
  <xy-space wrap>
    <xy-button type="primary" @click="enqueueAlerts">连续加入 4 条</xy-button>
    <xy-button plain @click="closeAll">closeAll()</xy-button>
    <xy-tag round status="primary">当前项：{{ currentTitle }}</xy-tag>
    <xy-tag round status="warning">queueLength：{{ snapshot.queueLength }}</xy-tag>
    <xy-tag round status="success">total：{{ snapshot.total }}</xy-tag>
  </xy-space>
</template>
