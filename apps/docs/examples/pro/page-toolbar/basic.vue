<template>
  <xy-page-toolbar
    title="成员管理"
    description="统一承接页面级动作和筛选区"
    bordered
    divider
  >
    <template #actions>
      <xy-button type="primary">新建成员</xy-button>
      <xy-button plain>批量导出</xy-button>
    </template>

    <xy-card>这里可以继续承接筛选区、统计标签或说明文案。</xy-card>
  </xy-page-toolbar>
</template>
