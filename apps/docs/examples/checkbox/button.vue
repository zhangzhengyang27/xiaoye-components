<script setup lang="ts">
import { ref } from "vue";

const dimensions = ref<Array<string | number | boolean>>(["day"]);
</script>

<template>
  <!-- 复选框按钮组：展示按钮样式的复选框组合 -->
  <div class="demo-checkbox-button">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-checkbox-button__header">
          <strong>按钮样式</strong>
          <xy-tag status="neutral" round>按钮组</xy-tag>
        </div>
        <p class="demo-checkbox-button__description">
          通过 type="button" 属性将复选框渲染为按钮组样式。
        </p>
      </template>

      <div class="demo-checkbox-button__content">
        <xy-checkbox-group
          v-model="dimensions"
          type="button"
          fill="var(--xy-color-primary)"
          text-color="var(--xy-color-white)"
          :options="[
            { label: '按天', value: 'day' },
            { label: '按周', value: 'week' },
            { label: '按月', value: 'month', disabled: true }
          ]"
        />
      </div>

      <template #footer>
        <xy-tag status="primary" round>
          当前维度：{{ dimensions.join("，") || "未选择" }}
        </xy-tag>
      </template>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-checkbox-button {
  max-width: 560px;
}

.demo-checkbox-button__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-checkbox-button__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}

.demo-checkbox-button__content {
  padding: 16px;
  border: 1px solid var(--xy-border-color-subtle);
  border-radius: 12px;
  background: var(--xy-bg-color-subtle);
}
</style>
