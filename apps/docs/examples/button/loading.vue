<template>
  <!-- 按钮加载状态：展示带加载指示的按钮 -->
  <div class="demo-button-loading">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-button-loading__header">
          <strong>加载状态</strong>
          <xy-tag status="neutral" round>Loading</xy-tag>
        </div>
        <p class="demo-button-loading__description">
          加载状态表示操作正在执行中，按钮不可再次点击。
        </p>
      </template>

      <xy-space wrap>
        <xy-button type="primary" loading>保存中</xy-button>
        <xy-button plain loading loading-icon="mdi:refresh">同步中</xy-button>
        <xy-button loading>
          <template #loading>
            <xy-space size="sm">
              <xy-icon icon="mdi:loading" spin />
              <span>处理中</span>
            </xy-space>
          </template>
          提交
        </xy-button>
      </xy-space>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-button-loading {
  max-width: 640px;
}

.demo-button-loading__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-button-loading__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}
</style>
