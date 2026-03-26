<template>
  <div class="alert-demo-stack">
    <xy-alert
      title="批量导出已排队"
      type="success"
      description="系统会在 2 分钟内生成下载包，并通过站内信通知结果。"
    />

    <xy-alert title="权限即将失效" type="error">
      当前审批角色将在今天 18:00 到期，请尽快完成交接或续期。
    </xy-alert>
  </div>
</template>

<style scoped>
.alert-demo-stack {
  display: grid;
  gap: 12px;
}
</style>
