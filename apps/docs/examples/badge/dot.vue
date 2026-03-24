<template>
  <div class="demo-badge-list">
    <xy-badge is-dot class="demo-badge-item">
      <xy-text>即时消息</xy-text>
    </xy-badge>
    <xy-badge is-dot type="success" class="demo-badge-item">
      <xy-button plain>在线</xy-button>
    </xy-badge>
    <xy-badge is-dot color="#0f766e" class="demo-badge-item">
      <xy-tag>自定义状态</xy-tag>
    </xy-badge>
  </div>
</template>

<style scoped>
.demo-badge-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.demo-badge-item {
  margin-top: 10px;
  margin-right: 40px;
}
</style>
