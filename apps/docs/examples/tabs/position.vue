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
    <xy-tabs
      v-model="activeKey"
      :items="items"
      tab-position="left"
    >
      <template #default="{ activeItem }">
        <div class="demo-side-panel">
          <div class="demo-side-panel__eyebrow">Workspace</div>
          <h4>{{ activeItem?.label }} 侧边面板</h4>
          <p>把页签当成局部导航，内容区更像一个独立工作台，而不是普通卡片。</p>
        </div>
      </template>
    </xy-tabs>
  </div>
</template>

<style scoped>
.demo-tabs-shell {
  padding: 0;
  border-radius: 0;
  background: transparent;
}

.demo-side-panel {
  min-height: 260px;
  padding: 30px 32px;
  border-radius: 22px;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.95)),
    radial-gradient(circle at top left, rgba(14, 165, 233, 0.12), transparent 28%);
  border: 1px solid rgba(148, 163, 184, 0.16);
}

.demo-side-panel__eyebrow {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  background: rgba(14, 165, 233, 0.1);
  color: #0284c7;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.demo-side-panel h4 {
  margin: 16px 0 8px;
  font-size: 24px;
  line-height: 1.2;
}

.demo-side-panel p {
  margin: 0;
  color: var(--xy-text-color-secondary);
  line-height: 1.7;
}
</style>
