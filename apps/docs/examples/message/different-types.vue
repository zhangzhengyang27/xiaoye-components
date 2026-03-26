<script setup lang="ts">
import { XyMessage } from "xiaoye-components";

function openMessage(type: "primary" | "success" | "info" | "warning" | "error") {
  XyMessage[type]({
    message: `当前触发的是 ${type} 类型消息。`,
    showClose: true
  });
}
</script>

<template>
  <xy-space wrap>
    <xy-button type="primary" @click="openMessage('primary')">primary</xy-button>
    <xy-button type="success" @click="openMessage('success')">success</xy-button>
    <xy-button plain @click="openMessage('info')">info</xy-button>
    <xy-button type="warning" @click="openMessage('warning')">warning</xy-button>
    <xy-button type="danger" @click="openMessage('error')">error</xy-button>
  </xy-space>
</template>
