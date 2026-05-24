<script setup lang="ts">
import { ref } from "vue";

const channel = ref<string | number | boolean>("email");
</script>

<template>
  <!-- 单选框基础用法：展示互斥选项的选中场景 -->
  <div class="demo-radio-basic">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-radio-basic__header">
          <strong>基础用法</strong>
          <xy-tag status="neutral" round>互斥选择</xy-tag>
        </div>
        <p class="demo-radio-basic__description">
          单选组用于在多个互斥选项中进行单一选择。
        </p>
      </template>

      <div class="demo-radio-basic__content">
        <xy-radio-group v-model="channel">
          <xy-radio value="email">邮件通知</xy-radio>
          <xy-radio value="sms">短信通知</xy-radio>
          <xy-radio value="webhook">Webhook</xy-radio>
        </xy-radio-group>
      </div>

      <template #footer>
        <xy-tag status="primary" round>
          当前选择：{{ channel }}
        </xy-tag>
      </template>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-radio-basic {
  max-width: 480px;
}

.demo-radio-basic__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-radio-basic__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}

.demo-radio-basic__content {
  padding: 16px;
  border: 1px solid var(--xy-border-color-subtle);
  border-radius: 12px;
  background: var(--xy-bg-color-subtle);
}
</style>
