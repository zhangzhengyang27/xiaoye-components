<script setup lang="ts">
const imageUrl = `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="264" height="72" viewBox="0 0 264 72">
    <defs>
      <linearGradient id="watermark-logo" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#2563eb" />
        <stop offset="100%" stop-color="#0f766e" />
      </linearGradient>
    </defs>
    <rect width="264" height="72" rx="20" fill="url(#watermark-logo)" opacity="0.95" />
    <circle cx="40" cy="36" r="18" fill="#ecfeff" opacity="0.96" />
    <path d="M90 24H150V32H90ZM90 40H174V48H90Z" fill="#eff6ff" />
  </svg>
`)}`;
</script>

<template>
  <xy-watermark :image="imageUrl" :width="132" :height="36">
    <section class="xy-doc-watermark-image-demo">
      <h4>品牌物料预览</h4>
      <p>图片水印适合统一品牌标识。这里用内联 SVG 模拟一张 2x Logo 水印图。</p>
    </section>
  </xy-watermark>
</template>

<style scoped>
.xy-doc-watermark-image-demo {
  min-height: 220px;
  padding: 28px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 24px;
  background:
    linear-gradient(180deg, rgba(248, 250, 252, 0.96), rgba(226, 232, 240, 0.9)),
    radial-gradient(circle at right top, rgba(14, 165, 233, 0.14), transparent 40%);
}

.xy-doc-watermark-image-demo h4 {
  margin: 0 0 12px;
  color: #0f172a;
  font-size: 24px;
}

.xy-doc-watermark-image-demo p {
  max-width: 520px;
  margin: 0;
  color: #334155;
  line-height: 1.7;
}
</style>
