<template>
  <div class="demo-link-group">
    <xy-link>默认链接</xy-link>
    <xy-link type="primary">主要链接</xy-link>
    <xy-link type="success">成功链接</xy-link>
    <xy-link type="warning">警告链接</xy-link>
    <xy-link type="info">信息链接</xy-link>
    <xy-link type="danger">危险链接</xy-link>
  </div>
</template>

<style scoped>
.demo-link-group {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
</style>
