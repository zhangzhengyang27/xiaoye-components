<script setup lang="ts">
import { ref } from "vue";

const value = ref(36);
</script>

<template>
  <!-- 滑块基础用法：展示数值选择滑块 -->
  <div class="demo-slider-basic">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-slider-basic__header">
          <strong>基础用法</strong>
          <xy-tag status="neutral" round>数值选择</xy-tag>
        </div>
        <p class="demo-slider-basic__description">
          滑块用于在范围内选择数值，适合预算、温度等连续值场景。
        </p>
      </template>

      <div class="demo-slider-basic__content">
        <xy-slider v-model="value" />
      </div>

      <template #footer>
        <xy-tag status="primary" round>当前值：{{ value }}</xy-tag>
      </template>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-slider-basic {
  max-width: 480px;
}

.demo-slider-basic__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-slider-basic__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}

.demo-slider-basic__content {
  padding: 16px;
  border: 1px solid var(--xy-border-color-subtle);
  border-radius: 12px;
  background: var(--xy-bg-color-subtle);
}
</style>
