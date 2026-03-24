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
          <p>禁用项会在键盘导航时被自动跳过，适合暂未开放或权限不足的页签。</p>
        </div>
      </template>
    </xy-tabs>
  </div>
</template>

<style scoped>
.demo-tabs-shell {
  padding: 8px;
  border-radius: 24px;
  background: linear-gradient(180deg, rgba(248, 250, 252, 0.96), rgba(241, 245, 249, 0.86));
}

.demo-tabs-panel {
  padding: 24px 28px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(148, 163, 184, 0.16);
}

.demo-tabs-panel--compact {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.demo-tabs-status {
  font-size: 28px;
  font-weight: 700;
  line-height: 1;
}

.demo-tabs-panel p {
  margin: 0;
  color: var(--xy-text-color-secondary);
  line-height: 1.7;
}
</style>
