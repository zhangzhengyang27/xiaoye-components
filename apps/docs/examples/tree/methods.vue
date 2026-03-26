<script setup lang="ts">
import { ref } from "vue";
import type { TreeInstance } from "xiaoye-components";

const treeRef = ref<TreeInstance | null>(null);
const currentKeyText = ref("未设置");
let nextId = 100;

const data = [
  {
    id: 1,
    label: "运营后台",
    children: [
      { id: 11, label: "首页看板" },
      { id: 12, label: "活动中心" }
    ]
  },
  {
    id: 2,
    label: "风控后台",
    children: [
      { id: 21, label: "规则管理" }
    ]
  }
];

function syncCurrentKey() {
  currentKeyText.value = String(treeRef.value?.getCurrentKey() ?? "未设置");
}

function setBillingCurrent() {
  treeRef.value?.setCurrentKey(12);
  syncCurrentKey();
}

function checkRiskNodes() {
  treeRef.value?.setCheckedKeys([2, 21]);
}

function appendNode() {
  treeRef.value?.append({ id: nextId++, label: `新增节点 ${nextId}` }, 2);
}

function removeRuleNode() {
  treeRef.value?.remove({ id: 21, label: "规则管理" });
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-button plain @click="setBillingCurrent">setCurrentKey(12)</xy-button>
      <xy-button plain @click="checkRiskNodes">setCheckedKeys([2, 21])</xy-button>
      <xy-button type="primary" @click="appendNode">append()</xy-button>
      <xy-button plain @click="removeRuleNode">remove()</xy-button>
    </xy-space>

    <xy-text size="sm" type="info">
      当前节点 key：{{ currentKeyText }}
    </xy-text>

    <div class="xy-doc-field">
      <xy-tree
        ref="treeRef"
        :data="data"
        node-key="id"
        show-checkbox
        default-expand-all
        @current-change="syncCurrentKey"
      />
    </div>
  </div>
</template>
