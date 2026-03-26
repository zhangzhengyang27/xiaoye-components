<script setup lang="ts">
import { ref } from "vue";

const open = ref(false);
const lastSize = ref("最近一次尺寸调整：尚未触发");

function handleResize(_event: MouseEvent, size: { width: number; height: number }) {
  lastSize.value = `最近一次尺寸调整：${size.width} x ${size.height}`;
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-tag status="info">{{ lastSize }}</xy-tag>
    <xy-button type="primary" @click="open = true">打开可调尺寸对话框</xy-button>

    <xy-dialog
      v-model="open"
      title="尺寸可调工作台"
      width="680px"
      resizable
      min-width="420px"
      max-width="960px"
      min-height="320px"
      max-height="80vh"
      @resize="handleResize"
    >
      <p>增强计划里会补右下角单手柄拖拽、最小最大边界，以及 `resize-start / resize / resize-end` 事件。</p>
    </xy-dialog>
  </div>
</template>

