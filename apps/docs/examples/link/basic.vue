<template>
  <!-- 链接基础用法：展示多种语义类型的链接 -->
  <div class="demo-link-basic">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-link-basic__header">
          <strong>基础用法</strong>
          <xy-tag status="neutral" round>语义类型</xy-tag>
        </div>
        <p class="demo-link-basic__description">
          链接用于跳转操作，支持多种语义颜色类型。
        </p>
      </template>

      <div class="demo-link-basic__content">
        <xy-link>默认链接</xy-link>
        <xy-link type="primary">主要链接</xy-link>
        <xy-link type="success">成功链接</xy-link>
        <xy-link type="warning">警告链接</xy-link>
        <xy-link type="info">信息链接</xy-link>
        <xy-link type="danger">危险链接</xy-link>
      </div>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-link-basic {
  max-width: 640px;
}

.demo-link-basic__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-link-basic__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}

.demo-link-basic__content {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}
</style>
