<script setup lang="ts">
import { ref } from "vue";
import { XyNotificationService } from "xiaoye-components";

const logs = ref<string[]>([
  "通过 XyNotificationService.open() 可以在任意业务模块直接触发通知。",
  "open() 返回的 handle 同时支持 close() 和 update()，适合持续更新同一条通知。"
]);

let currentHandle: ReturnType<typeof XyNotificationService.open> | null = null;

function openNotification() {
  currentHandle = XyNotificationService.open({
    title: "任务已开始",
    message: "正在把 24 条菜单权限同步到工作区。",
    type: "info",
    position: "top-right",
    duration: 3200
  });
  logs.value.unshift("已触发一条右上角 info 通知。");
}

function closeNotification() {
  currentHandle?.close();
  logs.value.unshift("已通过 handle.close() 主动关闭当前通知。");
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-button type="primary" @click="openNotification">open()</xy-button>
      <xy-button plain @click="closeNotification">handle.close()</xy-button>
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
