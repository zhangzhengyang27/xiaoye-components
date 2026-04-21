<template>
  <xyu-space>
    <xyu-button @click="showNotification('成功通知', '操作已成功完成', 'success')">成功</xyu-button>
    <xyu-button @click="showNotification('警告通知', '请注意操作风险', 'warning')">警告</xyu-button>
    <xyu-button @click="showNotification('错误通知', '操作失败，请重试', 'error')">错误</xyu-button>
    <xyu-button @click="showNotification('信息通知', '这是一条通知消息', 'info')">信息</xyu-button>
  </xyu-space>
</template>

<script setup lang="ts">
import { XyuNotification } from '@xiaoye/xiaoye-ui';

function showNotification(title: string, message: string, type: string) {
  XyuNotification({ title, message, type });
}
</script>
