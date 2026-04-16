<script setup lang="ts">
import { ref } from "vue";

const activeKey = ref("overview");
const items = [
  { key: "overview", label: "概览" },
  { key: "members", label: "成员" },
  { key: "billing", label: "账单" },
  { key: "logs", label: "日志" },
  { key: "alerts", label: "告警" },
  { key: "integrations", label: "集成" },
  { key: "audit", label: "审计" },
  { key: "settings", label: "设置" }
];
</script>

<template>
  <div class="demo-tabs-shell demo-tabs-shell--wide">
    <xy-tabs v-model="activeKey" :items="items">
      <template #default="{ activeItem }">
        <div class="demo-tabs-panel">
          <div class="demo-tabs-kicker">Scrollable nav</div>
          <h4 class="demo-tabs-panel__title">{{ activeItem?.label }} 面板</h4>
          <p class="demo-tabs-panel__description">
            页签过多时可以通过前后按钮切换，并且激活项会自动滚动到可见区域。
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

.demo-tabs-shell--wide {
  max-width: 760px;
}

.demo-tabs-panel {
  padding: 28px 30px;
  border-radius: var(--xy-radius-lg);
  background: var(--xy-surface-raised);
  border: 1px solid var(--xy-border-color-subtle);
  box-shadow: var(--xy-shadow-xs);
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
