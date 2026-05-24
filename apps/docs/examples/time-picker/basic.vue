<script setup lang="ts">
import { ref } from "vue";

const value = ref("09:30:15");
</script>

<template>
  <!-- 时间选择器基础用法：展示时间选择功能 -->
  <div class="demo-time-picker-basic">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-time-picker-basic__header">
          <strong>基础用法</strong>
          <xy-tag status="neutral" round>时间选择</xy-tag>
        </div>
        <p class="demo-time-picker-basic__description">
          时间选择器用于选择时间，支持清空操作。
        </p>
      </template>

      <xy-time-picker v-model="value" clearable />

      <template #footer>
        <xy-tag status="primary" round>当前时间：{{ value ?? "未选择" }}</xy-tag>
      </template>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-time-picker-basic {
  max-width: 400px;
}

.demo-time-picker-basic__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-time-picker-basic__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}
</style>
