<script setup lang="ts">
const imageUrl = `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="264" height="72" viewBox="0 0 264 72">
    <defs>
      <linearGradient id="watermark-logo" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#9ab0d3" />
        <stop offset="100%" stop-color="#9dbdaf" />
      </linearGradient>
    </defs>
    <rect width="264" height="72" rx="20" fill="url(#watermark-logo)" opacity="0.95" />
    <circle cx="40" cy="36" r="18" fill="#f8fbfd" opacity="0.96" />
    <path d="M90 24H150V32H90ZM90 40H174V48H90Z" fill="#edf2f8" />
  </svg>
`)}`;
</script>

<template>
  <xy-watermark :image="imageUrl" :width="132" :height="36">
    <section class="xy-doc-watermark-image-demo">
      <h4 class="xy-doc-watermark-image-demo__title">品牌物料预览</h4>
      <p class="xy-doc-watermark-image-demo__description">
        图片水印适合统一品牌标识。这里用内联 SVG 模拟一张 2x Logo 水印图。
      </p>
    </section>
  </xy-watermark>
</template>

<style scoped>
.xy-doc-watermark-image-demo {
  min-height: 220px;
  padding: 28px;
  border: 1px solid var(--xy-border-color-subtle);
  border-radius: var(--xy-radius-xl);
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--xy-bg-color-subtle) 92%, white),
    color-mix(in srgb, var(--xy-surface-sunken) 88%, white)
  );
  box-shadow: var(--xy-shadow-card);
}

.xy-doc-watermark-image-demo__title {
  margin: 0 0 12px;
  color: var(--xy-text-color-heading);
  font-size: 24px;
}

.xy-doc-watermark-image-demo__description {
  max-width: 520px;
  margin: 0;
  color: var(--xy-text-color-secondary);
  line-height: 1.7;
}
</style>
