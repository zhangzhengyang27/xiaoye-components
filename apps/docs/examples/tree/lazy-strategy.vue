<script setup lang="ts">
import { ref } from "vue";
import type { TreeInstance } from "xiaoye-components";

interface LazyNodeData {
  id: number;
  label: string;
  isLeaf?: boolean;
}

const checkDescendants = ref(false);
const treeRef = ref<TreeInstance | null>(null);
const checkedKeysText = ref("未触发");

const data: LazyNodeData[] = [
  { id: 1, label: "应用目录" },
  { id: 2, label: "已知叶子节点", isLeaf: true }
];

function load(
  node: { level: number; data?: LazyNodeData },
  resolve: (data: LazyNodeData[]) => void
) {
  window.setTimeout(() => {
    if (node.level === 1) {
      resolve([
        { id: 11, label: "账单应用", isLeaf: true },
        { id: 12, label: "风控应用", isLeaf: true }
      ]);
      return;
    }

    resolve([]);
  }, 240);
}

async function checkRoot() {
  treeRef.value?.setChecked(1, true, true);
  await new Promise((resolve) => {
    window.setTimeout(resolve, 300);
  });
  checkedKeysText.value = (treeRef.value?.getCheckedKeys() ?? []).join(", ") || "未勾选";
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-button plain @click="checkDescendants = !checkDescendants">
        checkDescendants: {{ checkDescendants ? "true" : "false" }}
      </xy-button>
      <xy-button type="primary" @click="checkRoot">setChecked(1, true, true)</xy-button>
    </xy-space>

    <xy-text size="sm" type="info">
      当前勾选 keys：{{ checkedKeysText }}
    </xy-text>

    <div class="xy-doc-field">
      <xy-tree
        ref="treeRef"
        :data="data"
        node-key="id"
        show-checkbox
        lazy
        :check-descendants="checkDescendants"
        :props="{ label: 'label', isLeaf: 'isLeaf' }"
        :load="load"
      />
    </div>
  </div>
</template>
