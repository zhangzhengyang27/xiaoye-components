<template>
  <!-- 图标尺寸：展示不同尺寸的图标 -->
  <div class="demo-icon-size">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-icon-size__header">
          <strong>尺寸</strong>
          <xy-tag status="neutral" round>Size</xy-tag>
        </div>
        <p class="demo-icon-size__description">
          图标支持自定义尺寸，通过 size 属性设置。
        </p>
      </template>

      <xy-space wrap align="center">
        <xy-icon icon="mdi:star-outline" :size="14" />
        <xy-icon icon="mdi:star-outline" :size="20" />
        <xy-icon icon="mdi:star-outline" :size="28" />
        <xy-icon icon="mdi:arrow-right" :size="20" :rotate="90" />
      </xy-space>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-icon-size {
  max-width: 480px;
}

.demo-icon-size__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-icon-size__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}
</style>
