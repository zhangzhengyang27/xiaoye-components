<script setup lang="ts">
import { ref } from "vue";
import { XyAlertService } from "xiaoye-components";

const seed = ref(0);

function enqueueAlerts() {
  const base = seed.value;

  XyAlertService.open({
    title: `队列任务 #${base + 1}`,
    description: "第一条会先显示，后面的提示会按 FIFO 顺序依次顶上。",
    type: "primary",
    duration: 1800,
    showIcon: true
  });
  XyAlertService.open({
    title: `队列任务 #${base + 2}`,
    description: "这条会在上一条消失后自动出现。",
    type: "warning",
    duration: 1800,
    showIcon: true
  });
  XyAlertService.open({
    title: `队列任务 #${base + 3}`,
    description: "队列中的等待项也可以通过句柄 update 或 close 做管理。",
    type: "success",
    duration: 1800,
    showIcon: true
  });

  seed.value += 3;
}

function closeAll() {
  XyAlertService.closeAll();
}
</script>

<template>
  <xy-space wrap>
    <xy-button type="primary" @click="enqueueAlerts">连续加入 3 条</xy-button>
    <xy-button plain @click="closeAll">closeAll()</xy-button>
    <xy-tag round status="primary">当前累计入队：{{ seed }}</xy-tag>
  </xy-space>
</template>
