<script setup lang="ts">
import { ref } from "vue";

const loading = ref(true);

function toggleLoading() {
  loading.value = !loading.value;
}
</script>

<template>
  <xy-config-provider
    :loading="{
      text: '使用全局 Loading 默认项',
      background: 'rgba(248, 250, 252, 0.88)',
      delay: 120
    }"
  >
    <div class="xy-doc-stack">
      <xy-space wrap>
        <xy-button type="primary" @click="toggleLoading">
          {{ loading ? "关闭" : "打开" }}全局 loading 默认项示例
        </xy-button>
        <xy-tag status="primary">同时会影响 Dialog / Table / Select 的默认 loading 视觉</xy-tag>
      </xy-space>

      <xy-card v-loading="loading" class="loading-demo-card">
        <div class="xy-doc-stack">
          <strong>全局默认项</strong>
          <p>
            通过 `ConfigProvider.loading` 可以统一 loading
            文案、背景色和时序默认值，减少页面层重复传参。
          </p>
        </div>
      </xy-card>
    </div>
  </xy-config-provider>
</template>
