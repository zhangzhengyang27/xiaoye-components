<template>
  <xyu-button @click="handleNotification">显示通知（无关闭按钮）</xyu-button>
</template>

<script setup lang="ts">
function handleNotification() {
  const xyuNotification = (window as any).XyuNotification;
  xyuNotification({
    title: "不可关闭的通知",
    message: "这条通知没有关闭按钮",
    type: "info",
    showClose: false,
    duration: 0
  });
}
</script>
