<template>
  <!-- 空状态基础用法：展示无数据时的占位效果 -->
  <div class="demo-empty-basic">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-empty-basic__header">
          <strong>基础用法</strong>
          <xy-tag status="neutral" round>无数据</xy-tag>
        </div>
        <p class="demo-empty-basic__description">
          当列表、表格或搜索结果无数据时，显示空状态占位。
        </p>
      </template>

      <xy-empty />
    </xy-card>
  </div>
</template>

<style scoped>
.demo-empty-basic {
  max-width: 480px;
}

.demo-empty-basic__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-empty-basic__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}
</style>
