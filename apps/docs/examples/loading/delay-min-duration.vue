<script setup lang="ts">
import { computed, ref } from "vue";

const loading = ref(false);
const status = ref("等待触发");

const loadingOptions = computed(() => ({
  visible: loading.value,
  delay: 180,
  minDuration: 700,
  text: "正在比对差异..."
}));

async function simulateFastTask() {
  status.value = "快速请求开始";
  loading.value = true;
  await new Promise((resolve) => window.setTimeout(resolve, 100));
  loading.value = false;
  status.value = "快速请求结束，不会闪一下就消失";
}

async function simulateSlowTask() {
  status.value = "慢请求开始";
  loading.value = true;
  await new Promise((resolve) => window.setTimeout(resolve, 1200));
  loading.value = false;
  status.value = "慢请求结束，最短展示时长已生效";
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-button type="primary" @click="simulateFastTask">快速请求</xy-button>
      <xy-button plain @click="simulateSlowTask">慢请求</xy-button>
      <xy-tag status="neutral">{{ status }}</xy-tag>
    </xy-space>

    <xy-card v-loading="loadingOptions" class="loading-demo-card">
      <div class="xy-doc-stack">
        <strong>版本差异面板</strong>
        <p>`delay` 可以避免请求太快时的闪烁，`minDuration` 可以保证真的展示出来后不会一闪而过。</p>
      </div>
    </xy-card>
  </div>
</template>
