<script setup lang="ts">
const imageUrl = `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f766e" />
        <stop offset="100%" stop-color="#22c55e" />
      </linearGradient>
    </defs>
    <rect width="96" height="96" rx="20" fill="url(#g)" />
    <circle cx="48" cy="38" r="16" fill="#ecfeff" />
    <path d="M24 78c7-12 18-18 24-18s17 6 24 18" fill="#ecfeff" />
  </svg>
`)}`;
</script>

<template>
  <!-- 头像基础用法：支持文字、图片、图标和多种形状 -->
  <div class="demo-avatar-basic">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-avatar-basic__header">
          <strong>基础用法</strong>
          <xy-tag status="neutral" round>多种形态</xy-tag>
        </div>
        <p class="demo-avatar-basic__description">
          支持文字头像、图片头像、图标头像，以及圆形和方形两种形状。
        </p>
      </template>

      <xy-space wrap align="center">
        <xy-avatar>叶</xy-avatar>
        <xy-avatar icon="mdi:account-outline" />
        <xy-avatar :src="imageUrl" alt="avatar image" />
        <xy-avatar shape="square">AB</xy-avatar>
      </xy-space>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-avatar-basic {
  max-width: 560px;
}

.demo-avatar-basic__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-avatar-basic__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}
</style>
