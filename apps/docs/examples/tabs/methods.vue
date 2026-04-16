<script setup lang="ts">
import { ref } from "vue";

const activeKey = ref("overview");
const tabsRef = ref<{
  currentName: string;
} | null>(null);

const items = [
  { key: "overview", label: "概览" },
  { key: "members", label: "成员" },
  { key: "billing", label: "账单" }
];
</script>

<template>
  <div class="demo-tabs-shell">
    <xy-space wrap>
      <xy-button plain @click="activeKey = 'members'">切到成员</xy-button>
      <xy-tag status="primary"> expose.currentName：{{ tabsRef?.currentName ?? "-" }} </xy-tag>
    </xy-space>

    <xy-tabs ref="tabsRef" v-model="activeKey" :items="items">
      <template #default="{ activeItem }">
        <div class="demo-tabs-panel">
          <h4 class="demo-tabs-panel__title">{{ activeItem?.label }} 面板</h4>
          <p class="demo-tabs-panel__description">
            这个示例展示了外部按钮控制激活页签，以及通过 expose 读取当前 key。
          </p>
        </div>
      </template>
    </xy-tabs>

    <xy-text size="sm">
      激活页签后，可以继续用键盘 <kbd>ArrowLeft</kbd>、<kbd>ArrowRight</kbd>、<kbd>Home</kbd>、<kbd
        >End</kbd
      >
      做导航。
    </xy-text>
  </div>
</template>

<style scoped>
.demo-tabs-shell {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 8px;
  border-radius: var(--xy-radius-xl);
  border: 1px solid var(--xy-border-color-subtle);
  background: color-mix(in srgb, var(--xy-bg-color-subtle) 84%, white);
}

.demo-tabs-panel {
  padding: 26px 28px;
  border-radius: var(--xy-radius-lg);
  background: var(--xy-surface-raised);
  border: 1px solid var(--xy-border-color-subtle);
  box-shadow: var(--xy-shadow-xs);
}

.demo-tabs-panel__title {
  margin: 0 0 8px;
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
