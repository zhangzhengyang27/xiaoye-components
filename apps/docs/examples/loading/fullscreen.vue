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
  <!-- 全屏加载：展示全屏遮罩加载效果 -->
  <div class="demo-loading-fullscreen">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-loading-fullscreen__header">
          <strong>全屏加载</strong>
          <xy-tag status="neutral" round>Fullscreen</xy-tag>
        </div>
        <p class="demo-loading-fullscreen__description">
          全屏加载配合锁定滚动，适合全页切换和必须阻断操作的流程。
        </p>
      </template>

      <xy-alert type="info" show-icon title="fullscreen + lock">
        适合全页切换、批量导入和必须短暂阻断滚动的后台流程。
      </xy-alert>

      <xy-button type="primary" @click="openFullscreenLoading">打开全屏加载</xy-button>

      <div v-loading.fullscreen.lock="loading" />
    </xy-card>
  </div>
</template>

<style scoped>
.demo-loading-fullscreen {
  max-width: 640px;
}

.demo-loading-fullscreen__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-loading-fullscreen__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}
</style>
