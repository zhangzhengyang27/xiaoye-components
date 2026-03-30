<script setup lang="ts">
const metaItems = [
  {
    label: "负责人",
    value: "小叶",
    icon: "mdi:account-circle"
  },
  {
    label: "更新时间",
    value: "2026-03-30 14:20",
    icon: "mdi:clock-outline"
  },
  {
    label: "环境",
    value: "生产环境",
    icon: "mdi:rocket-launch-outline"
  }
];
</script>

<template>
  <xy-page-header
    title="成员中心"
    description="统一承接页面标题、说明和辅助元信息。"
    :meta-items="metaItems"
    divider
    bordered
  >
    <template #actions>
      <xy-button plain>导出日报</xy-button>
      <xy-button type="primary">新建成员</xy-button>
    </template>
  </xy-page-header>
</template>
