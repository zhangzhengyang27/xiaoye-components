<template>
  <div class="alert-demo-stack">
    <xy-alert
      title="默认布局"
      type="info"
      variant="default"
      description="适合嵌在表单、筛选区和详情页内容块中。"
      show-icon
    />

    <xy-alert
      title="横幅布局"
      type="warning"
      variant="banner"
      description="更适合页面顶部、分区头部或需要横向扫读的提醒。"
      show-icon
    >
      <template #actions>
        <xy-button size="sm" type="primary">立即查看</xy-button>
      </template>
    </xy-alert>

    <xy-alert
      title="卡片布局"
      type="success"
      variant="card"
      description="适合承接更完整的反馈内容、补充说明和轻操作。"
      show-icon
    >
      <template #actions>
        <xy-button size="sm" plain>查看详情</xy-button>
      </template>
    </xy-alert>
  </div>
</template>

<style scoped>
.alert-demo-stack {
  display: grid;
  gap: 12px;
}
</style>
