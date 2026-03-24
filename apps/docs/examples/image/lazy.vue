<script setup lang="ts">
const imageUrl = `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="360" height="220" viewBox="0 0 360 220">
    <rect width="360" height="220" rx="28" fill="#e2e8f0" />
    <rect x="18" y="18" width="324" height="184" rx="22" fill="#cbd5e1" />
    <rect x="52" y="56" width="152" height="20" rx="10" fill="#64748b" />
    <rect x="52" y="92" width="96" height="18" rx="9" fill="#94a3b8" />
    <circle cx="268" cy="104" r="28" fill="#2563eb" />
  </svg>
`)}`;
</script>

<template>
  <div class="xy-doc-image-demo">
    <div class="xy-doc-image-demo__panel">
      <div class="xy-doc-image-demo__meta">
        <span class="xy-doc-image-demo__kicker">Lazy</span>
        <div>
          <h4>把加载状态也纳入展示体验</h4>
          <p>适合长列表、资源流和滚动容器中的图片，让首屏更轻，同时保留稳定占位。</p>
        </div>
      </div>

      <div class="xy-doc-image-demo__media">
        <xy-image :src="imageUrl" lazy style="width: 320px; height: 196px; border-radius: 20px">
          <template #placeholder>
            <div class="xy-doc-image-placeholder">图片加载中</div>
          </template>
        </xy-image>
      </div>
    </div>
  </div>
</template>
