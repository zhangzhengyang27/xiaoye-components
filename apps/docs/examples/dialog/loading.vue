<script setup lang="ts">
import { ref } from "vue";

const open = ref(false);
const loading = ref(false);

async function simulateLoad() {
  loading.value = true;
  await new Promise((resolve) => window.setTimeout(resolve, 1000));
  loading.value = false;
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-button type="primary" @click="open = true">打开加载态对话框</xy-button>

    <xy-dialog
      v-model="open"
      title="正在同步变更"
      width="560px"
      :loading="loading"
      loading-text="正在同步配置，请稍候..."
    >
      <div class="xy-doc-stack">
        <p>增强计划里会把 loading 遮罩收敛到 body 内部，只阻断内容区交互，不强制禁用右上角关闭按钮。</p>
        <xy-button type="primary" :loading="loading" @click="simulateLoad">模拟加载</xy-button>
      </div>
    </xy-dialog>
  </div>
</template>

