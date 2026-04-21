<template>
  <xyu-button type="primary" @click="handleCustom">自定义对话框</xyu-button>
</template>

<script setup lang="ts">
function handleCustom() {
  const xyuMessageBox = (window as any).XyuMessageBox;
  xyuMessageBox.alert("这是一条自定义消息", "自定义标题", {
    confirmText: "好的",
    cancelText: "不了",
    type: "warning"
  });
}
</script>
