<template>
  <div class="alert-demo-stack">
    <xy-alert
      title="默认折叠的长描述"
      type="warning"
      show-icon
      collapsible
      description="这是一段更适合放进折叠描述里的说明文案，用来承接审批风险、上下游影响、执行窗口和回滚建议。默认状态下只展示两行，避免把页面顶部的提示区拉得过长。"
    />

    <xy-alert
      title="默认展开的长描述"
      type="primary"
      variant="card"
      show-icon
      collapsible
      :default-expanded="true"
      description="对于需要一开始就完整呈现的说明，可以打开 default-expanded。这样在详情页或关键配置确认区里，就不需要用户先点击展开才能看到全部上下文。"
    />
  </div>
</template>

<style scoped>
.alert-demo-stack {
  display: grid;
  gap: 12px;
}
</style>
