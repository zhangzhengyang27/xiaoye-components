<script setup lang="ts">
import { ref } from "vue";
import type { TreeInstance } from "xiaoye-components";

const treeRef = ref<TreeInstance | null>(null);
const checkedKeysText = ref("未读取");

const data = [
  {
    id: 1,
    label: "系统权限",
    children: [
      { id: 11, label: "用户管理" },
      { id: 12, label: "角色管理" }
    ]
  },
  {
    id: 2,
    label: "业务权限",
    children: [
      { id: 21, label: "订单审核" },
      { id: 22, label: "退款审批" }
    ]
  }
];

function readCheckedKeys() {
  const keys = treeRef.value?.getCheckedKeys() ?? [];
  checkedKeysText.value = keys.length > 0 ? keys.join(", ") : "未勾选";
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-button plain @click="readCheckedKeys">读取勾选结果</xy-button>
      <xy-text size="sm" type="info">当前勾选：{{ checkedKeysText }}</xy-text>
    </xy-space>

    <div class="xy-doc-field">
      <xy-tree
        ref="treeRef"
        :data="data"
        node-key="id"
        show-checkbox
        default-expand-all
      />
    </div>
  </div>
</template>
