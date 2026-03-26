<script setup lang="ts">
import { ref } from "vue";
import type { TreeInstance } from "xiaoye-components";

const treeRef = ref<TreeInstance | null>(null);
const pathText = ref("点击按钮读取路径");

const data = [
  {
    id: 1,
    label: "平台配置",
    children: [
      {
        id: 11,
        label: "菜单中心",
        children: [{ id: 111, label: "工作台入口" }]
      }
    ]
  },
  {
    id: 2,
    label: "业务配置",
    children: [{ id: 21, label: "订单规则" }]
  }
];

function readPath() {
  const path = treeRef.value?.getNodePath(111) ?? [];
  pathText.value = path.map((item) => item.label).join(" / ") || "未找到节点";
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-button type="primary" @click="readPath">getNodePath(111)</xy-button>
      <xy-text size="sm" type="info">{{ pathText }}</xy-text>
    </xy-space>

    <div class="xy-doc-field">
      <xy-tree
        ref="treeRef"
        :data="data"
        node-key="id"
        default-expand-all
      />
    </div>
  </div>
</template>
