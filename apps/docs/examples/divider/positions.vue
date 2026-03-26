<template>
  <div class="divider-demo-positions">
    <xy-divider content-position="left">筛选条件</xy-divider>
    <xy-divider>当前摘要</xy-divider>
    <xy-divider content-position="right">
      <xy-tag status="primary" round>本周重点</xy-tag>
    </xy-divider>
  </div>
</template>

<style scoped>
.divider-demo-positions {
  display: grid;
  gap: 4px;
}
</style>
