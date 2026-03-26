<script setup lang="ts">
import { XyMessage } from "xiaoye-components";

function openGlobalMessage() {
  XyMessage("这条消息会继承当前 Config Provider 里的默认配置。");
}
</script>

<template>
  <xy-config-provider
    :message="{
      placement: 'bottom-right',
      showClose: true,
      duration: 0,
      grouping: true,
      max: 2,
      closeOnClick: true
    }"
  >
    <xy-space wrap>
      <xy-button type="primary" @click="openGlobalMessage"> 触发继承全局配置的消息 </xy-button>
      <xy-tag status="primary">
        placement / showClose / duration / grouping / max / closeOnClick 都来自 Config Provider
      </xy-tag>
    </xy-space>
  </xy-config-provider>
</template>
