<script setup lang="ts">
import { ref } from "vue";

const placement = ref<"bottom-start" | "top-start" | "right-start" | "left-start">("bottom-start");
const lastAction = ref("最近操作：暂无");
const items = [
  { key: "assign", label: "分配负责人" },
  { key: "sync", label: "立即同步" },
  { key: "archive", label: "归档当前记录", danger: true }
];

function handleSelect(item: { label: string }) {
  lastAction.value = `最近操作：${item.label}`;
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-button plain @click="placement = 'bottom-start'">bottom-start</xy-button>
      <xy-button plain @click="placement = 'top-start'">top-start</xy-button>
      <xy-button plain @click="placement = 'right-start'">right-start</xy-button>
      <xy-button plain @click="placement = 'left-start'">left-start</xy-button>
    </xy-space>

    <xy-dropdown :items="items" :placement="placement" @select="handleSelect">
      <xy-button type="primary">打开操作菜单</xy-button>
    </xy-dropdown>

    <xy-space wrap>
      <xy-tag status="primary">当前 placement：{{ placement }}</xy-tag>
      <xy-tag status="neutral">{{ lastAction }}</xy-tag>
    </xy-space>
  </div>
</template>
