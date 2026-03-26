<script setup lang="ts">
import { XyMessage } from "xiaoye-components";

function pushGroupedMessage() {
  XyMessage({
    message: "资源同步仍在进行中",
    grouping: true,
    type: "info",
    duration: 2400
  });
}
</script>

<template>
  <xy-space wrap>
    <xy-button type="primary" @click="pushGroupedMessage"> 连续触发同一条消息 </xy-button>
    <xy-tag status="info">重复触发后会折叠成一条并显示计数</xy-tag>
  </xy-space>
</template>
