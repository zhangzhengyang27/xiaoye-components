<script setup lang="ts">
const formModel = {
  name: "审批流模板",
  owner: "小叶",
  status: "enabled"
};

const schema = [
  {
    prop: "name",
    label: "流程名称"
  },
  {
    prop: "owner",
    label: "负责人"
  },
  {
    prop: "status",
    label: "状态",
    valueType: "tag",
    options: [
      {
        label: "启用",
        value: "enabled",
        status: "success"
      }
    ]
  }
];
</script>

<template>
  <xy-request-form
    title="审批流查看"
    description="当请求表单只承担加载和查看职责时，可以直接开启 readonly。"
    :model="formModel"
    :schema="schema"
    :immediate="false"
    readonly
  />
</template>

