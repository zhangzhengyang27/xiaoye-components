<template>
  <div class="alert-demo-stack">
    <xy-alert
      title="发布检查未通过"
      type="error"
      show-icon
      description="检测到首页 Banner 缺少移动端素材，请补齐后再执行发布。"
    />

    <xy-alert
      title="审批链路已更新"
      type="success"
      show-icon
      description="新的负责人和抄送范围会在下一次发起流程时自动生效。"
    />
  </div>
</template>

<style scoped>
.alert-demo-stack {
  display: grid;
  gap: 12px;
}
</style>
