<script setup lang="ts">
const items = [
  { key: "all", label: "全部" },
  { key: "pending", label: "待处理" },
  { key: "archived", label: "已归档", disabled: true }
];
</script>

<template>
  <div class="demo-tabs-shell">
    <xy-tabs :items="items">
      <template #default="{ activeKey }">
        <div class="demo-tabs-panel demo-tabs-panel--compact">
          <span class="demo-tabs-status">当前页签：{{ activeKey }}</span>
          <p class="demo-tabs-panel__description">
            禁用项会在键盘导航时被自动跳过，适合暂未开放或权限不足的页签。
          </p>
        </div>
      </template>
    </xy-tabs>
  </div>
</template>

<style scoped>
.demo-tabs-shell {
  padding: 8px;
  border-radius: var(--xy-radius-xl);
  border: 1px solid var(--xy-border-color-subtle);
  background: color-mix(in srgb, var(--xy-bg-color-subtle) 84%, white);
}

.demo-tabs-panel {
  padding: 24px 28px;
  border-radius: var(--xy-radius-lg);
  background: var(--xy-surface-raised);
  border: 1px solid var(--xy-border-color-subtle);
  box-shadow: var(--xy-shadow-xs);
}

.demo-tabs-panel--compact {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.demo-tabs-status {
  color: var(--xy-text-color-heading);
  font-size: 28px;
  font-weight: 700;
  line-height: 1;
}

.demo-tabs-panel__description {
  margin: 0;
  color: var(--xy-text-color-secondary);
  line-height: 1.7;
}
</style>
