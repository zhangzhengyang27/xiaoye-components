<script setup lang="ts">
import { XyAlertService } from "xiaoye-components";

let currentHandle: ReturnType<typeof XyAlertService.open> | null = null;

function openAlert() {
  currentHandle = XyAlertService.open({
    title: "全局发布提醒",
    description: "这条提示会以顶部横幅的方式展示，不需要在当前页面预先放置任何组件节点。",
    type: "warning",
    showIcon: true,
    closable: true,
    duration: 0
  });
}

function updateAlert() {
  currentHandle?.update({
    title: "全局提醒已更新",
    type: "success",
    description: "你可以通过句柄实时更新当前提示的标题、文案、状态和时长。"
  });
}

function closeAlert() {
  currentHandle?.close();
}
</script>

<template>
  <xy-space wrap>
    <xy-button type="primary" @click="openAlert">open()</xy-button>
    <xy-button plain @click="updateAlert">handle.update()</xy-button>
    <xy-button plain @click="closeAlert">handle.close()</xy-button>
  </xy-space>
</template>
