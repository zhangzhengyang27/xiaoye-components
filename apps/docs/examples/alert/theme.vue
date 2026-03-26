<template>
  <div class="alert-demo-stack">
    <xy-alert title="浅色成功提示" type="success" />
    <xy-alert title="浅色风险提示" type="warning" />
    <xy-alert title="深色成功提示" type="success" effect="dark" />
    <xy-alert title="深色错误提示" type="error" effect="dark" />
  </div>
</template>

<style scoped>
.alert-demo-stack {
  display: grid;
  gap: 12px;
}
</style>
