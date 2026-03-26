<script setup lang="ts">
const data = [
  {
    id: 1,
    label: "基础资料",
    children: [
      { id: 11, label: "企业信息" },
      { id: 12, label: "结算信息" }
    ]
  },
  {
    id: 2,
    label: "流程配置",
    children: [
      { id: 21, label: "审批流" },
      { id: 22, label: "通知模板" }
    ]
  }
];
</script>

<template>
  <div class="xy-doc-field">
    <xy-tree
      :data="data"
      node-key="id"
      show-checkbox
      highlight-current
      :default-expanded-keys="[1, 2]"
      :default-checked-keys="[12, 21]"
      :current-node-key="21"
    />
  </div>
</template>
