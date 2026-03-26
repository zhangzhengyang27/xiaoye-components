<script setup lang="ts">
import { ref } from "vue";

const visible = ref(false);
const latestMessage = ref("最近一次自动关闭：尚未触发");

function openAlert() {
  visible.value = false;
  requestAnimationFrame(() => {
    visible.value = true;
  });
}

function handleAutoClose() {
  latestMessage.value = `最近一次自动关闭：${new Date().toLocaleTimeString()}`;
}
</script>

<template>
  <div class="alert-demo-stack">
    <xy-space>
      <xy-button type="primary" @click="openAlert">显示 3 秒后自动关闭</xy-button>
      <xy-tag round status="primary">duration = 3000</xy-tag>
    </xy-space>

    <xy-alert
      v-model="visible"
      title="导出队列已创建"
      type="success"
      :duration="3000"
      show-icon
      description="这个提示会在显示 3 秒后自动关闭，同时触发 auto-close 事件。"
      @auto-close="handleAutoClose"
    />

    <xy-tag round status="success">{{ latestMessage }}</xy-tag>
  </div>
</template>

<style scoped>
.alert-demo-stack {
  display: grid;
  gap: 12px;
}
</style>
