<template>
  <div class="alert-demo-stack">
    <xy-alert
      title="检测到权限范围变更"
      type="warning"
      description="建议先核对受影响成员，再决定是否立即应用。"
      show-icon
    >
      <template #actions>
        <xy-button size="sm" type="primary">立即处理</xy-button>
        <xy-button size="sm" plain>稍后再说</xy-button>
      </template>
    </xy-alert>

    <xy-alert
      title="发布检查未通过"
      type="error"
      variant="card"
      description="首页 Banner 缺少移动端素材，请补齐后再重试。"
      show-icon
    >
      <template #actions>
        <xy-button size="sm" plain>查看缺失项</xy-button>
        <xy-button size="sm" type="primary">前往修复</xy-button>
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
