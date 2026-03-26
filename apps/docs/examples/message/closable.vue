<script setup lang="ts">
import { XyMessage } from "xiaoye-components";

function openPersistentMessage() {
  XyMessage({
    message: "这条消息不会自动关闭，适合承接明确的人工确认。",
    type: "warning",
    showClose: true,
    duration: 0
  });
}
</script>

<template>
  <xy-button type="primary" @click="openPersistentMessage"> 打开可手动关闭提示 </xy-button>
</template>
