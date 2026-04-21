<template>
  <xyu-space direction="vertical" style="width: 100%">
    <xyu-button @click="handleNotification('success')">成功通知</xyu-button>
    <xyu-button @click="handleNotification('warning')">警告通知</xyu-button>
    <xyu-button @click="handleNotification('error')">错误通知</xyu-button>
    <xyu-button @click="handleNotification('info')">信息通知</xyu-button>
  </xyu-space>
</template>

<script setup lang="ts">
function handleNotification(type: string) {
  const xyuNotification = (window as any).XyuNotification;
  xyuNotification({
    title: "提示",
    message: `这是一条${type}类型通知`,
    type
  });
}
</script>
