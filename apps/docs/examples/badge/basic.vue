<template>
  <div class="demo-badge-list">
    <xy-badge :value="12" class="demo-badge-item">
      <xy-button plain>评论</xy-button>
    </xy-badge>
    <xy-badge :value="3" type="primary" class="demo-badge-item">
      <xy-button plain>通知</xy-button>
    </xy-badge>
    <xy-badge :value="1" type="warning" class="demo-badge-item">
      <xy-button plain>审批</xy-button>
    </xy-badge>
    <xy-badge :value="8" color="#0f766e" class="demo-badge-item">
      <xy-button plain>自定义色</xy-button>
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
  margin-right: 30px;
}
</style>
