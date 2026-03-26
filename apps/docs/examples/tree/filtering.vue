<script setup lang="ts">
import { ref, watch } from "vue";
import type { TreeInstance } from "xiaoye-components";

const keyword = ref("");
const treeRef = ref<TreeInstance | null>(null);

const data = [
  {
    id: 1,
    label: "应用中心",
    children: [
      {
        id: 11,
        label: "结算系统",
        children: [{ id: 111, label: "账单流水" }]
      }
    ]
  },
  {
    id: 2,
    label: "协同中心",
    children: [
      { id: 21, label: "待办列表" },
      { id: 22, label: "知识库" }
    ]
  }
];

watch(keyword, (value) => {
  treeRef.value?.filter(value);
});

function filterNode(value: string, node: { label: string }) {
  return !value || node.label.includes(value);
}
</script>

<template>
  <div class="xy-doc-stack">
    <div class="xy-doc-field">
      <xy-input v-model="keyword" placeholder="输入关键词过滤节点" clearable />
    </div>

    <div class="xy-doc-field">
      <xy-tree
        ref="treeRef"
        :data="data"
        node-key="id"
        :filter-node-method="filterNode"
      />
    </div>
  </div>
</template>
