<template>
  <div class="divider-demo-status">
    <xy-divider>默认分组</xy-divider>
    <xy-divider status="primary">重点推进</xy-divider>
    <xy-divider status="success">已完成校验</xy-divider>
    <xy-divider status="warning">待补充说明</xy-divider>
    <xy-divider status="danger">异常待处理</xy-divider>
  </div>
</template>

<style scoped>
.divider-demo-status {
  display: grid;
  gap: 2px;
}
</style>
