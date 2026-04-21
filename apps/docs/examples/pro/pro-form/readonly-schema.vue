<script setup lang="ts">
const formModel = {
  name: "成员工作台",
  status: "reviewing",
  budget: 128000.5,
  updatedAt: "2026-04-19T10:30:00+08:00"
};

const schema = [
  {
    prop: "name",
    label: "方案名称"
  },
  {
    prop: "status",
    label: "当前状态",
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
    label: "最近更新",
    valueType: "datetime"
  }
];
</script>

<template>
  <xy-pro-form
    title="方案详情"
    description="当页面进入查看态时，schema 会自动切成 Descriptions 只读渲染，而不是展示一组禁用输入框。"
    :model="formModel"
    :schema="schema"
    readonly
    :show-submit="false"
    :show-reset="false"
  />
</template>

