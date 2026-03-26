<script setup lang="ts">
import { XyLoadingService } from "xiaoye-components";

function openServiceLoading() {
  const loading = XyLoadingService({
    text: "正在发布版本...",
    lock: true
  });

  window.setTimeout(() => {
    loading.setText("正在刷新缓存...");
  }, 600);

  window.setTimeout(() => {
    loading.close();
  }, 1400);
}
</script>

<template>
  <xy-space wrap>
    <xy-button type="primary" @click="openServiceLoading">打开 service 加载</xy-button>
    <xy-tag status="neutral">默认会以 fullscreen 形态挂到 body</xy-tag>
  </xy-space>
</template>
