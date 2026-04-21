<template>
  <xyu-space>
    <xyu-button @click="showMessage('成功提示', 'success')">成功</xyu-button>
    <xyu-button @click="showMessage('警告提示', 'warning')">警告</xyu-button>
    <xyu-button @click="showMessage('错误提示', 'error')">错误</xyu-button>
    <xyu-button @click="showMessage('信息提示', 'info')">信息</xyu-button>
  </xyu-space>
</template>

<script setup lang="ts">
import { XyuMessage } from '@xiaoye/xiaoye-ui';

function showMessage(text: string, type: string) {
  XyuMessage({ message: text, type });
}
</script>
