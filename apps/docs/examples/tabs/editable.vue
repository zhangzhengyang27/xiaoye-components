<script setup lang="ts">
import { ref } from "vue";

const tabIndex = ref(3);
const activeKey = ref("overview");
const items = ref([
  { key: "overview", label: "概览" },
  { key: "members", label: "成员", closable: true },
  { key: "billing", label: "账单", closable: true }
]);

function handleEdit(key: string | undefined, action: "remove" | "add") {
  if (action === "add") {
    tabIndex.value += 1;
    const nextKey = `tab-${tabIndex.value}`;
    items.value = [
      ...items.value,
      { key: nextKey, label: `新页签 ${tabIndex.value}`, closable: true }
    ];
    activeKey.value = nextKey;
    return;
  }

  if (!key) {
    return;
  }

  const index = items.value.findIndex((item) => item.key === key);
  items.value = items.value.filter((item) => item.key !== key);

  if (activeKey.value === key) {
    activeKey.value = items.value[index]?.key ?? items.value[index - 1]?.key ?? "";
  }
}
</script>

<template>
  <div class="demo-tabs-shell">
    <xy-tabs v-model="activeKey" :items="items" editable @edit="handleEdit">
      <template #default="{ activeItem }">
        <div class="demo-tabs-panel">
          <div class="demo-tabs-meta">Workspace tabs</div>
          <h4 class="demo-tabs-panel__title">{{ activeItem?.label }} 面板</h4>
          <p class="demo-tabs-panel__description">这一组适合控制台、侧滑详情和多个局部工作区共存的场景。</p>
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
  padding: 28px 30px;
  border-radius: var(--xy-radius-lg);
  background: var(--xy-surface-raised);
  border: 1px solid var(--xy-border-color-subtle);
  box-shadow: var(--xy-shadow-xs);
}

.demo-tabs-meta {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  width: fit-content;
  padding: 0 10px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--xy-color-primary-soft) 58%, white);
  color: var(--xy-color-primary);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.demo-tabs-panel__title {
  margin: 14px 0 8px;
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
