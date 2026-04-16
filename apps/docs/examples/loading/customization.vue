<script setup lang="ts">
import { ref } from "vue";

const loading = ref(true);

const customSvg = `
  <path
    d="M25 5 A20 20 0 1 1 24.99 5"
    fill="none"
    stroke="currentColor"
    stroke-width="3"
    stroke-linecap="round"
  />
`;
</script>

<template>
  <div class="xy-doc-stack">
    <xy-button @click="loading = !loading">{{ loading ? "关闭" : "打开" }}自定义加载</xy-button>

    <xy-card
      v-loading="loading"
      xy-loading-text="正在同步审批流..."
      :xy-loading-svg="customSvg"
      xy-loading-svg-view-box="0 0 50 50"
      xy-loading-background="color-mix(in srgb, var(--xy-bg-color-overlay) 88%, white)"
      xy-loading-custom-class="demo-loading-customization__mask-soft"
      class="loading-demo-card"
    >
      <div class="xy-doc-stack">
        <strong>审批配置</strong>
        <p>这里演示文案、自定义 SVG 和遮罩背景色的组合方式。</p>
      </div>
    </xy-card>
  </div>
</template>
