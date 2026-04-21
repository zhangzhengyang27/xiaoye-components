<template>
  <xyu-button @click="showMessage">显示可关闭消息</xyu-button>
</template>

<script setup lang="ts">
import { XyuMessage } from '@xiaoye/xiaoye-ui';

function showMessage() {
  XyuMessage({ message: '这是一条可关闭的消息', type: 'info', showClose: true });
}
</script>
