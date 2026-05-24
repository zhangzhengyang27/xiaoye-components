<template>
  <!-- 间距基础用法：展示按钮之间的间距控制 -->
  <div class="demo-space-basic">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-space-basic__header">
          <strong>基础用法</strong>
          <xy-tag status="neutral" round>间距控制</xy-tag>
        </div>
        <p class="demo-space-basic__description">
          Space 组件用于控制元素之间的间距，支持水平和垂直方向。
        </p>
      </template>

      <xy-space>
        <xy-button type="primary">保存</xy-button>
        <xy-button plain>取消</xy-button>
        <xy-button text>更多设置</xy-button>
      </xy-space>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-space-basic {
  max-width: 480px;
}

.demo-space-basic__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-space-basic__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}
</style>
