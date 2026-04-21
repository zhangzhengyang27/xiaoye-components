<script setup lang="ts">
const sections = [
  {
    key: "base",
    title: "基础信息",
    model: {
      owner: "小叶",
      status: "reviewing",
      updatedAt: "2026-04-18T14:30:00+08:00",
      budget: 128000.5
    },
    schema: [
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
            label: "审核中",
            value: "reviewing",
            status: "warning"
          }
        ]
      },
      {
        prop: "updatedAt",
        label: "最近更新",
        valueType: "datetime"
      },
      {
        prop: "budget",
        label: "预算",
        valueType: "money"
      }
    ]
  }
];

const attachments = [
  {
    id: 1,
    name: "权限矩阵.xlsx",
    size: "128 KB",
    status: "success" as const
  }
];

const changes = [
  {
    key: "role",
    label: "角色",
    before: "运营",
    after: "管理员",
    status: "changed" as const
  }
];

const logs = [
  {
    id: "1",
    title: "提交复核",
    operator: "小叶",
    timestamp: "2026-03-28 09:20",
    status: "processing" as const
  }
];
</script>

<template>
  <xy-detail-page
    title="成员详情"
    description="DetailPage 适合标准后台详情页。"
    :sections="sections"
    :attachments="attachments"
    :changes="changes"
    :logs="logs"
  />
</template>
