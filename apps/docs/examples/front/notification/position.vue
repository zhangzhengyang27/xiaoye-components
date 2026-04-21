<template>
  <xyu-space direction="vertical" style="width: 100%">
    <xyu-button @click="handleNotification('top-left')">左上角</xyu-button>
    <xyu-button @click="handleNotification('top-right')">右上角</xyu-button>
    <xyu-button @click="handleNotification('bottom-left')">左下角</xyu-button>
    <xyu-button @click="handleNotification('bottom-right')">右下角</xyu-button>
  </xyu-space>
</template>

<script setup lang="ts">
function handleNotification(position: string) {
  const xyuNotification = (window as any).XyuNotification;
  xyuNotification({
    title: "位置通知",
    message: `显示在 ${position}`,
    position
  });
}
</script>
