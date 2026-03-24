<template>
  <div class="demo-badge-list">
    <xy-badge :value="200" :max="99" class="demo-badge-item">
      <xy-button plain>消息</xy-button>
    </xy-badge>
    <xy-badge :value="0" :show-zero="false" class="demo-badge-item">
      <xy-button plain>零值隐藏</xy-button>
    </xy-badge>
    <xy-badge :value="0" class="demo-badge-item">
      <xy-button plain>零值显示</xy-button>
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
