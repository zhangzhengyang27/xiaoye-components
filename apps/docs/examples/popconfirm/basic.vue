<template>
  <!-- 气泡确认框基础用法：展示点击触发确认操作 -->
  <div class="demo-popconfirm-basic">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-popconfirm-basic__header">
          <strong>基础用法</strong>
          <xy-tag status="neutral" round>确认操作</xy-tag>
        </div>
        <p class="demo-popconfirm-basic__description">
          气泡确认框用于需要二次确认的危险操作，点击后弹出确认提示。
        </p>
      </template>

      <xy-popconfirm
        title="确定要归档这批记录吗？"
        content="归档后会从当前列表移除，但仍可在历史记录中找回。"
      >
        <template #reference>
          <xy-button plain>归档记录</xy-button>
        </template>
      </xy-popconfirm>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-popconfirm-basic {
  max-width: 480px;
}

.demo-popconfirm-basic__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-popconfirm-basic__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}
</style>
