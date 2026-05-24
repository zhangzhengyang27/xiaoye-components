<template>
  <!-- 警告提示图标：展示带图标的警告提示 -->
  <div class="demo-alert-icon">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-alert-icon__header">
          <strong>图标</strong>
          <xy-tag status="neutral" round>Icon</xy-tag>
        </div>
        <p class="demo-alert-icon__description">
          警告提示可以显示图标，支持默认图标和自定义图标。
        </p>
      </template>

      <div class="demo-alert-icon__list">
        <xy-alert title="默认图标提示" type="info" show-icon />

        <xy-alert title="自定义图标提示" type="primary" show-icon>
          <template #icon>
            <xy-icon icon="mdi:shield-check-outline" :size="20" />
          </template>
        </xy-alert>
      </div>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-alert-icon {
  max-width: 640px;
}

.demo-alert-icon__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-alert-icon__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}

.demo-alert-icon__list {
  display: grid;
  gap: 12px;
}
</style>
