<script setup lang="ts">
import { XyMessage } from "xiaoye-components";

function openPlainMessage() {
  XyMessage({
    message: "这是一条更轻的 plain 风格消息。",
    type: "primary",
    plain: true,
    icon: "mdi:palette-outline",
    showClose: true
  });
}
</script>

<template>
  <xy-button plain @click="openPlainMessage">打开 plain + 自定义图标</xy-button>
</template>
