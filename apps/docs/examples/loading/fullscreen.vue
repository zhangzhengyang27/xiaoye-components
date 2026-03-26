<script setup lang="ts">
import { ref } from "vue";

const loading = ref(false);

function openFullscreenLoading() {
  loading.value = true;
  window.setTimeout(() => {
    loading.value = false;
  }, 1200);
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-alert type="info" show-icon title="fullscreen + lock">
      适合全页切换、批量导入和必须短暂阻断滚动的后台流程。
    </xy-alert>
    <xy-button type="primary" @click="openFullscreenLoading">打开全屏加载</xy-button>

    <div v-loading.fullscreen.lock="loading" />
  </div>
</template>
