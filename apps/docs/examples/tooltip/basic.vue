<template>
  <!-- 气泡提示基础用法：展示 hover 和 focus 触发的提示 -->
  <div class="demo-tooltip-basic">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-tooltip-basic__header">
          <strong>基础用法</strong>
          <xy-tag status="neutral" round>文字提示</xy-tag>
        </div>
        <p class="demo-tooltip-basic__description">
          气泡提示用于简短的信息提示，hover 或 focus 时显示。
        </p>
      </template>

      <xy-space wrap>
        <xy-tooltip content="这个按钮会立即提交当前表单">
          <xy-button plain>Hover 查看提示</xy-button>
        </xy-tooltip>
        <xy-tooltip content="支持 focus 打开和 Escape 关闭">
          <xy-button type="primary">Focus 也可触发</xy-button>
        </xy-tooltip>
      </xy-space>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-tooltip-basic {
  max-width: 480px;
}

.demo-tooltip-basic__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-tooltip-basic__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}
</style>
