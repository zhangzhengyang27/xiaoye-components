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
    items.value = [...items.value, { key: nextKey, label: `新页签 ${tabIndex.value}`, closable: true }];
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
          <h4>{{ activeItem?.label }} 面板</h4>
          <p>这一组适合控制台、侧滑详情和多个局部工作区共存的场景。</p>
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
  padding: 28px 30px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(148, 163, 184, 0.16);
}

.demo-tabs-meta {
  color: var(--xy-text-color-muted);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.demo-tabs-panel h4 {
  margin: 14px 0 8px;
  font-size: 24px;
  line-height: 1.2;
}

.demo-tabs-panel p {
  margin: 0;
  color: var(--xy-text-color-secondary);
  line-height: 1.7;
}
</style>
