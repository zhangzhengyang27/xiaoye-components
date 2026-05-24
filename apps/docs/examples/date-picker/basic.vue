<script setup lang="ts">
import { ref } from "vue";

const value = ref<string | null>("2026-03-22");
</script>

<template>
  <!-- 日期选择器基础用法：展示日期选择功能 -->
  <div class="demo-date-picker-basic">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-date-picker-basic__header">
          <strong>基础用法</strong>
          <xy-tag status="neutral" round>日期选择</xy-tag>
        </div>
        <p class="demo-date-picker-basic__description">
          日期选择器用于选择单个日期，支持清空操作。
        </p>
      </template>

      <xy-date-picker v-model="value" clearable />

      <template #footer>
        <xy-tag status="primary" round>当前日期：{{ value ?? "未选择" }}</xy-tag>
      </template>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-date-picker-basic {
  max-width: 400px;
}

.demo-date-picker-basic__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-date-picker-basic__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}
</style>
