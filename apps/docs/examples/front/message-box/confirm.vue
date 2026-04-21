<template>
  <xyu-button type="primary" @click="handleConfirm">显示确认对话框</xyu-button>
</template>

<script setup lang="ts">
import { getCurrentInstance } from "vue";

function handleConfirm() {
  const xyuMessageBox = (window as any).XyuMessageBox;
  xyuMessageBox.confirm("确定要执行此操作吗？", "确认提示");
}
</script>
