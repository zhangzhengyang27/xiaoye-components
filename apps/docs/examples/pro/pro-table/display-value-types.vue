<script setup lang="ts">
import { h } from "vue";

const rows = [
  {
    id: 1,
    name: "成员工作台",
    status: "enabled",
    tags: ["core", "urgent"],
    progress: 78,
    budget: 128000.5,
    homepage: "https://xiaoye.dev/workbench",
    token: "workspace-token-2026",
    updatedAt: "2026-04-18T14:30:00+08:00",
    badge: "稳定",
    htmlNote: "已接入 <strong>值类型显示协议</strong>"
  }
];

const columns = [
  {
    prop: "name",
    label: "名称"
  },
  {
    prop: "status",
    label: "状态映射",
    valueType: "select",
    options: [
      { label: "启用", value: "enabled", status: "success" },
      { label: "停用", value: "disabled", status: "danger" }
    ]
  },
  {
    prop: "tags",
    label: "标签组",
    valueType: "tag",
    options: [
      { label: "核心项目", value: "core", status: "primary" },
      { label: "加急", value: "urgent", status: "warning" }
    ]
  },
  {
    prop: "progress",
    label: "进度",
    valueType: "progress",
    formatter: (_row: unknown, _column: unknown, value: unknown) => `${value ?? 0}%`
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
  },
  {
    prop: "homepage",
    label: "链接",
    valueType: "link",
    formatter: () => "打开工作台"
  },
  {
    prop: "token",
    label: "复制值",
    valueType: "copy"
  },
  {
    prop: "badge",
    label: "render",
    render: (value: unknown) =>
      h(
        "strong",
        {
          style: {
            color: "var(--xy-color-primary)"
          }
        },
        `自定义渲染：${value ?? "-"}`
      )
  },
  {
    prop: "htmlNote",
    label: "renderHTML",
    renderHTML: (value: unknown) => `<span>${String(value ?? "-")}</span>`
  }
];
</script>

<template>
  <xy-pro-table
    title="显示协议示例"
    description="当前除了 valueType / formatter / render / renderHTML，还补上了 copy 和状态点式回显，继续沿显示协议收口。"
    :data="rows"
    :columns="columns"
    :pagination="false"
    :table-props="{ rowKey: 'id' }"
  />
</template>
