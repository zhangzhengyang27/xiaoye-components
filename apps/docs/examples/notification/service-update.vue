<script setup lang="ts">
import { ref } from "vue";
import { XyNotificationService } from "xiaoye-components";

const logs = ref<string[]>(["先 open()，再通过 handle.update() 更新同一条通知。"]);
let currentHandle: ReturnType<typeof XyNotificationService.open> | null = null;

function openNotification() {
  currentHandle = XyNotificationService.open({
    title: "同步任务已开始",
    message: "正在同步 24 条权限配置。",
    duration: 0,
    type: "info"
  });
  logs.value.unshift("已创建一条可更新通知。");
}

function updateNotification() {
  currentHandle?.update({
    title: "同步任务已完成",
    message: "所有权限配置均已同步到工作区。",
    type: "success",
    position: "bottom-right",
    showClose: false
  });
  logs.value.unshift("已通过 handle.update() 更新标题、内容、类型和位置。");
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-button type="primary" @click="openNotification">open()</xy-button>
      <xy-button plain @click="updateNotification">handle.update()</xy-button>
      <xy-button plain @click="currentHandle?.close()">handle.close()</xy-button>
    </xy-space>

    <div class="notification-log-board">
      <div v-for="log in logs" :key="log" class="xy-doc-note">{{ log }}</div>
    </div>
  </div>
</template>

<style scoped>
.notification-log-board {
  display: grid;
  gap: 8px;
}
</style>
