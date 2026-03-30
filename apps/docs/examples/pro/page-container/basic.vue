<script setup lang="ts">
const metaItems = [
  {
    label: "负责人",
    value: "小叶",
    icon: "mdi:account-circle"
  },
  {
    label: "成员数",
    value: 128,
    icon: "mdi:account-multiple-outline"
  }
];
</script>

<template>
  <xy-page-container
    title="成员中心"
    description="默认头部会自动承接标题、说明、metaItems 和 actions。"
    :meta-items="metaItems"
    bordered
    shadow
  >
    <template #actions>
      <xy-button plain>批量导出</xy-button>
      <xy-button type="primary">新增成员</xy-button>
    </template>

    <xy-card header="本周重点">
      <p>这里承接页面主体内容，例如表格、说明卡片或详情区块。</p>
      <p>当头部信息足够时，不需要额外手写 `PageHeader`。</p>
    </xy-card>

    <template #footer>
      <xy-space>
        <xy-button>返回列表</xy-button>
        <xy-button type="primary">保存草稿</xy-button>
      </xy-space>
    </template>
  </xy-page-container>
</template>
