<template>
  <xyu-button @click="openMessageBox">打开消息框</xyu-button>
</template>

<script setup lang="ts">
import { XyuMessageBox } from '@xiaoye/xiaoye-ui';

async function openMessageBox() {
  await XyuMessageBox.confirm({
    title: '确认操作',
    message: '确定要执行此操作吗？'
  });
}
</script>
