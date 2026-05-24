<script setup lang="ts">
import { ref } from "vue";

const serviceScore = ref(3);
</script>

<template>
  <!-- 评分基础用法：展示星级评分组件 -->
  <div class="demo-rate-basic">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-rate-basic__header">
          <strong>基础用法</strong>
          <xy-tag status="neutral" round>星级评分</xy-tag>
        </div>
        <p class="demo-rate-basic__description">
          评分组件用于收集用户满意度或服务质量评价。
        </p>
      </template>

      <div class="demo-rate-basic__content">
        <xy-rate v-model="serviceScore" />
      </div>

      <template #footer>
        <xy-tag status="primary" round>当前评分：{{ serviceScore }}</xy-tag>
      </template>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-rate-basic {
  max-width: 480px;
}

.demo-rate-basic__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-rate-basic__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}

.demo-rate-basic__content {
  padding: 16px;
  border: 1px solid var(--xy-border-color-subtle);
  border-radius: 12px;
  background: var(--xy-bg-color-subtle);
}
</style>
