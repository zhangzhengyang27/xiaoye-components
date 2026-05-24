<script setup lang="ts">
import { ref } from "vue";

const visible = ref(true);

function reopen() {
  visible.value = false;

  requestAnimationFrame(() => {
    visible.value = true;
  });
}
</script>

<template>
  <!-- 通知基础用法：展示页面内的通知消息 -->
  <div class="demo-notification-basic">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-notification-basic__header">
          <strong>基础用法</strong>
          <xy-tag status="neutral" round>页面通知</xy-tag>
        </div>
        <p class="demo-notification-basic__description">
          通知用于页面内的消息反馈，适合局部操作的反馈提示。
        </p>
      </template>

      <xy-space wrap>
        <xy-button type="primary" @click="reopen">重新显示组件通知</xy-button>
      </xy-space>
    </xy-card>

    <xy-notification
      v-model="visible"
      title="审批流已更新"
      type="success"
      :duration="0"
    >
      新节点会在 2 分钟内同步到所有工作区。
    </xy-notification>
  </div>
</template>

<style scoped>
.demo-notification-basic {
  max-width: 640px;
}

.demo-notification-basic__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-notification-basic__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}
</style>
