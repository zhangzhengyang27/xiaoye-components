<template>
  <!-- 徽章基础用法：展示数字徽章和多种类型 -->
  <div class="demo-badge-basic">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-badge-basic__header">
          <strong>基础用法</strong>
          <xy-tag status="neutral" round>消息计数</xy-tag>
        </div>
        <p class="demo-badge-basic__description">
          徽章用于显示未读消息数量或状态标记，常用于通知按钮。
        </p>
      </template>

      <xy-space wrap align="center">
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
      </xy-space>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-badge-basic {
  max-width: 560px;
}

.demo-badge-basic__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-badge-basic__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}

.demo-badge-item {
  margin-top: 10px;
  margin-right: 30px;
}
</style>
