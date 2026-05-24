<template>
  <!-- 标签基础用法：展示 5 种语义状态 -->
  <div class="demo-tag-basic">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-tag-basic__header">
          <strong>基础用法</strong>
          <xy-tag status="neutral" round>语义状态</xy-tag>
        </div>
        <p class="demo-tag-basic__description">
          用于状态标识、分类标记等场景，支持多种语义颜色。
        </p>
      </template>

      <xy-space wrap>
        <xy-tag>默认</xy-tag>
        <xy-tag status="primary">进行中</xy-tag>
        <xy-tag status="success">已完成</xy-tag>
        <xy-tag status="warning">待确认</xy-tag>
        <xy-tag status="danger">已拒绝</xy-tag>
      </xy-space>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-tag-basic {
  max-width: 560px;
}

.demo-tag-basic__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-tag-basic__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}
</style>
