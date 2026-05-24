<script setup lang="ts">
import { ref } from "vue";

const open = ref(false);
const overflow = ref(false);
</script>

<template>
  <!-- 可拖拽对话框：展示可拖动位置的对话框 -->
  <div class="demo-dialog-draggable">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-dialog-draggable__header">
          <strong>可拖拽</strong>
          <xy-tag status="neutral" round>Draggable</xy-tag>
        </div>
        <p class="demo-dialog-draggable__description">
          拖动对话框头部可自由调整位置，支持限制在视口内。
        </p>
      </template>

      <xy-space wrap>
        <xy-button type="primary" @click="open = true">打开可拖拽对话框</xy-button>
        <xy-switch v-model="overflow" />
        <xy-tag :status="overflow ? 'warning' : 'success'" round>
          {{ overflow ? "允许拖出视口" : "限制在视口内" }}
        </xy-tag>
      </xy-space>
    </xy-card>

    <xy-dialog
      v-model="open"
      title="拖动头部试试看"
      draggable
      :overflow="overflow"
      width="560px"
    >
      <p>默认只允许拖动头部区域；如果开启 `overflow`，可以把 dialog 拖到视口边界之外。</p>
    </xy-dialog>
  </div>
</template>

<style scoped>
.demo-dialog-draggable {
  max-width: 640px;
}

.demo-dialog-draggable__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-dialog-draggable__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}
</style>

