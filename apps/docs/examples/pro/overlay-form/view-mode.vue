<script setup lang="ts">
import { reactive, ref } from "vue";

const open = ref(false);
const formModel = reactive({
  name: "成员工作台",
  status: "reviewing",
  budget: 128000.5,
  updatedAt: "2026-04-19T10:30:00+08:00"
});

const schema = [
  {
    prop: "name",
    label: "名称"
  },
  {
    prop: "status",
    label: "状态",
    valueType: "tag",
    options: [
      {
        label: "审核中",
        value: "reviewing",
        status: "warning"
      }
    ]
  },
  {
    prop: "budget",
    label: "预算",
    valueType: "money"
  },
  {
    prop: "updatedAt",
    label: "更新时间",
    valueType: "datetime"
  }
];
</script>

<template>
  <div class="xy-pro-demo-stack">
    <xy-button type="primary" @click="open = true">打开查看态</xy-button>

    <xy-overlay-form
      v-model:open="open"
      container="drawer"
      mode="view"
      title="覆盖层查看"
      :model="formModel"
      :schema="schema"
    />
  </div>
</template>

