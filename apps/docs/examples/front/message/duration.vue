<template>
  <xyu-button @click="handleMessage">显示 5 秒消息</xyu-button>
</template>

<script setup lang="ts">
function handleMessage() {
  const xyuMessage = (window as any).XyuMessage;
  xyuMessage.info("这条消息将显示 5 秒", { duration: 5000 });
}
</script>
