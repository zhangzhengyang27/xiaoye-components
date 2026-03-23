<template>
  <div class="demo-text-stack">
    <xy-text>默认文本</xy-text>
    <xy-text type="primary">主要文本</xy-text>
    <xy-text type="success">成功文本</xy-text>
    <xy-text type="info">信息文本</xy-text>
    <xy-text type="warning">警告文本</xy-text>
    <xy-text type="danger">危险文本</xy-text>
  </div>
</template>

<style scoped>
.demo-text-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
</style>
