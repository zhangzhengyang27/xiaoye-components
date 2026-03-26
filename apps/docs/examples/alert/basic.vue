<template>
  <div class="alert-demo-stack">
    <xy-alert title="主提示" type="primary" />
    <xy-alert title="成功提示" type="success" />
    <xy-alert title="信息提示" type="info" />
    <xy-alert title="警告提示" type="warning" />
    <xy-alert title="错误提示" type="error" />
  </div>
</template>

<style scoped>
.alert-demo-stack {
  display: grid;
  gap: 12px;
}
</style>
