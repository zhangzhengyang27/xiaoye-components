<script setup lang="ts">
import { ref } from "vue";

const activeKey = ref("draft");
const dirty = ref(true);
const items = [
  { key: "draft", label: "草稿" },
  { key: "publish", label: "发布" },
  { key: "history", label: "历史" }
];

function beforeLeave(nextKey: string, prevKey: string) {
  if (!dirty.value || prevKey !== "draft") {
    return true;
  }

  const confirmed = window.confirm(`草稿尚未保存，确定从 ${prevKey} 切换到 ${nextKey} 吗？`);

  if (confirmed) {
    dirty.value = false;
  }

  return confirmed;
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-tag :status="dirty ? 'warning' : 'success'">
        {{ dirty ? "草稿未保存" : "状态已同步" }}
      </xy-tag>
      <xy-button plain @click="dirty = !dirty">
        {{ dirty ? "标记为已保存" : "重新标记为未保存" }}
      </xy-button>
    </xy-space>

    <xy-tabs v-model="activeKey" :items="items" :before-leave="beforeLeave">
      <template #default="{ activeKey: key }">
        <div class="demo-panel">当前页签：{{ key }}</div>
      </template>
    </xy-tabs>
  </div>
</template>
