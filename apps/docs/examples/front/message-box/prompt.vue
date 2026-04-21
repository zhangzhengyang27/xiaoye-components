<template>
  <xyu-button type="primary" @click="handlePrompt">显示输入对话框</xyu-button>
</template>

<script setup lang="ts">
function handlePrompt() {
  const xyuMessageBox = (window as any).XyuMessageBox;
  xyuMessageBox.prompt("请输入您的姓名：", "输入提示");
}
</script>
