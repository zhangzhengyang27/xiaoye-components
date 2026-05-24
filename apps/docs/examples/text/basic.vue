<template>
  <!-- 文本基础用法：展示多种语义类型的文本颜色 -->
  <div class="demo-text-basic">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-text-basic__header">
          <strong>基础用法</strong>
          <xy-tag status="neutral" round>语义颜色</xy-tag>
        </div>
        <p class="demo-text-basic__description">
          Text 组件用于统一文本颜色样式，支持多种语义类型。
        </p>
      </template>

      <div class="demo-text-basic__content">
        <xy-text>默认文本</xy-text>
        <xy-text type="primary">主要文本</xy-text>
        <xy-text type="success">成功文本</xy-text>
        <xy-text type="info">信息文本</xy-text>
        <xy-text type="warning">警告文本</xy-text>
        <xy-text type="danger">危险文本</xy-text>
      </div>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-text-basic {
  max-width: 640px;
}

.demo-text-basic__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-text-basic__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}

.demo-text-basic__content {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}
</style>
