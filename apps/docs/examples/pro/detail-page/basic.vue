<script setup lang="ts">
const sections = [
  {
    key: "base",
    title: "基础信息"
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
  >
    <template #base>
      <xy-descriptions :column="2" border>
        <xy-descriptions-item label="负责人">小叶</xy-descriptions-item>
        <xy-descriptions-item label="状态">审核中</xy-descriptions-item>
      </xy-descriptions>
    </template>
  </xy-detail-page>
</template>
