<template>
  <xyu-space direction="vertical">
    <xyu-button @click="showMessage('这是一条消息提示', 'success')">成功消息</xyu-button>
    <xyu-button @click="showMessage('这是一条警告提示', 'warning')">警告消息</xyu-button>
    <xyu-button @click="showMessage('这是一条错误提示', 'error')">错误消息</xyu-button>
    <xyu-button @click="showMessage('这是一条普通提示', 'info')">普通消息</xyu-button>
  </xyu-space>
</template>

<script setup lang="ts">
import { XyuMessage } from '@xiaoye/xiaoye-ui';

function showMessage(text: string, type: string) {
  XyuMessage({ message: text, type });
}
</script>
