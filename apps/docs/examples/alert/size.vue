<template>
  <div class="alert-demo-stack">
    <xy-alert title="小尺寸提示" type="info" size="sm" show-icon />
    <xy-alert title="默认尺寸提示" type="primary" size="md" show-icon />
    <xy-alert
      title="大尺寸提示"
      type="warning"
      size="lg"
      show-icon
      description="适合更强调的页头说明或流程关键提醒。"
    />
  </div>
</template>

<style scoped>
.alert-demo-stack {
  display: grid;
  gap: 12px;
}
</style>
