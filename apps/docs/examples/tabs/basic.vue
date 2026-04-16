<script setup lang="ts">
import { ref } from "vue";

const activeKey = ref("overview");
const items = [
  { key: "overview", label: "概览" },
  { key: "members", label: "成员" },
  { key: "billing", label: "账单" }
];
</script>

<template>
  <div class="demo-tabs-shell">
    <xy-tabs v-model="activeKey" :items="items">
      <template #default="{ activeItem }">
        <div class="demo-tabs-panel">
          <div class="demo-tabs-kicker">Dashboard</div>
          <h4 class="demo-tabs-panel__title">{{ activeItem?.label }} 面板</h4>
          <p class="demo-tabs-panel__description">用更轻的导航条切换概览、成员和账单等局部视图。</p>
        </div>
      </template>
    </xy-tabs>
  </div>
</template>

<style scoped>
.demo-tabs-shell {
  padding: 8px;
  border-radius: var(--xy-radius-xl);
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--xy-bg-color-subtle) 92%, white),
    var(--xy-surface-raised)
  );
}

.demo-tabs-panel {
  padding: 28px 30px;
  border-radius: var(--xy-radius-lg);
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--xy-bg-color-subtle) 94%, white),
    var(--xy-surface-raised)
  );
  border: 1px solid var(--xy-border-color-subtle);
}

.demo-tabs-kicker {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  background: var(--xy-color-primary-soft);
  color: var(--xy-color-primary);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.demo-tabs-panel__title {
  margin: 16px 0 8px;
  color: var(--xy-text-color-heading);
  font-size: 24px;
  line-height: 1.2;
}

.demo-tabs-panel__description {
  margin: 0;
  color: var(--xy-text-color-secondary);
  line-height: 1.7;
}
</style>
