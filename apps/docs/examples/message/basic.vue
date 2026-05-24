<script setup lang="ts">
import { XyMessage } from "xiaoye-components";

// 显示操作结果反馈提示
function showOperationFeedback() {
  XyMessage("数据保存成功，已自动同步到服务器。");
}
</script>

<template>
  <!-- 消息提示基础用法：展示全局轻量级操作反馈 -->
  <div class="demo-message-basic">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-message-basic__header">
          <strong>基础用法</strong>
          <xy-tag status="neutral" round>全局提示</xy-tag>
        </div>
        <p class="demo-message-basic__description">
          点击按钮触发操作，点击后会在页面顶部显示消息提示。
        </p>
      </template>

      <xy-button type="primary" @click="showOperationFeedback">保存数据</xy-button>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-message-basic {
  max-width: 480px;
}

.demo-message-basic__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-message-basic__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}
</style>
