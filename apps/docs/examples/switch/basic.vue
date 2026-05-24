<script setup lang="ts">
import { ref } from "vue";

// 功能开关状态：默认开启
const isFeatureEnabled = ref(true);
</script>

<template>
  <!-- 开关基础用法：展示带文字描述的双向绑定和状态反馈 -->
  <div class="demo-switch-basic">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-switch-basic__header">
          <strong>基础用法</strong>
          <xy-tag status="neutral" round>双向绑定</xy-tag>
        </div>
        <p class="demo-switch-basic__description">
          适用于需要即时生效的开关场景，配合文字说明状态。
        </p>
      </template>

      <div class="demo-switch-basic__content">
        <div class="demo-switch-basic__control">
          <xy-switch v-model="isFeatureEnabled" active-text="已启用" inactive-text="已停用" />
        </div>
        <xy-tag :status="isFeatureEnabled ? 'success' : 'warning'" round>
          {{ isFeatureEnabled ? "当前功能已启用" : "当前功能已停用" }}
        </xy-tag>
      </div>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-switch-basic {
  max-width: 480px;
}

.demo-switch-basic__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-switch-basic__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}

.demo-switch-basic__content {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.demo-switch-basic__control {
  padding: 16px;
  border: 1px solid var(--xy-border-color-subtle);
  border-radius: 12px;
  background: var(--xy-bg-color-subtle);
}
</style>
