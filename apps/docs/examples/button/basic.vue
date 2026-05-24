<template>
  <!-- 按钮类型：展示 Button 组件的 5 种语义类型 -->
  <div class="demo-button-basic">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-button-basic__header">
          <strong>基础用法</strong>
          <xy-tag status="neutral" round>语义类型</xy-tag>
        </div>
      </template>
      <xy-space wrap>
        <xy-button>默认按钮</xy-button>
        <xy-button type="primary">主要按钮</xy-button>
        <xy-button type="success">成功按钮</xy-button>
        <xy-button type="warning">提醒按钮</xy-button>
        <xy-button type="danger">危险按钮</xy-button>
      </xy-space>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-button-basic {
  max-width: 640px;
}

.demo-button-basic__header {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
