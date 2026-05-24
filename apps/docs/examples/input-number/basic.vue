<script setup lang="ts">
import { ref } from "vue";

const quantity = ref(3);
</script>

<template>
  <!-- 数字输入框基础用法：展示带按钮的数值输入 -->
  <div class="demo-input-number-basic">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-input-number-basic__header">
          <strong>基础用法</strong>
          <xy-tag status="neutral" round>数值输入</xy-tag>
        </div>
        <p class="demo-input-number-basic__description">
          数字输入框支持步进按钮、自定义步长和范围限制。
        </p>
      </template>

      <xy-space direction="vertical" fill>
        <xy-input-number v-model="quantity" :min="1" :max="9" />
        <xy-input-number :min="0" :max="100" :step="5" placeholder="按 5 递增" />
        <xy-input-number :model-value="12" :controls="false" align="left" />
      </xy-space>

      <template #footer>
        <xy-tag status="primary" round>当前数量：{{ quantity }}</xy-tag>
      </template>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-input-number-basic {
  max-width: 400px;
}

.demo-input-number-basic__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-input-number-basic__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}
</style>
