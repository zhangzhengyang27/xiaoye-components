<template>
  <!-- 图标基础用法：展示常用图标 -->
  <div class="demo-icon-basic">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-icon-basic__header">
          <strong>基础用法</strong>
          <xy-tag status="neutral" round>图标展示</xy-tag>
        </div>
        <p class="demo-icon-basic__description">
          图标用于增强视觉表达，支持旋转动画等效果。
        </p>
      </template>

      <xy-space wrap>
        <xy-icon icon="mdi:magnify" />
        <xy-icon icon="mdi:information-outline" />
        <xy-icon icon="mdi:close" />
        <xy-icon icon="mdi:chevron-down" />
        <xy-icon icon="mdi:loading" spin />
      </xy-space>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-icon-basic {
  max-width: 480px;
}

.demo-icon-basic__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-icon-basic__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}
</style>
