<script setup lang="ts">
import { XyNotificationService } from "xiaoye-components";

function openInherited() {
  XyNotificationService.open({
    title: "继承 ConfigProvider.notification"
  });
}

function openOverridden() {
  XyNotificationService.open({
    title: "显式覆盖默认值",
    position: "top-right",
    showClose: true
  });
}
</script>

<template>
  <xy-config-provider
    :notification="{
      duration: 0,
      position: 'bottom-left',
      showClose: false,
      max: 2,
      overflowStrategy: 'drop-oldest'
    }"
  >
    <xy-space wrap>
      <xy-button type="primary" @click="openInherited">继承默认配置</xy-button>
      <xy-button plain @click="openOverridden">显式覆盖</xy-button>
      <xy-tag round status="primary">
        duration / position / showClose / max / overflowStrategy 来自 ConfigProvider
      </xy-tag>
    </xy-space>
  </xy-config-provider>
</template>
