<script setup lang="ts">
const imageUrl = `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="360" height="220" viewBox="0 0 360 220">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#dfe9e4" />
        <stop offset="100%" stop-color="#dbe5f3" />
      </linearGradient>
    </defs>
    <rect width="360" height="220" rx="28" fill="url(#g)" />
    <circle cx="102" cy="94" r="28" fill="#f8fbff" />
    <path d="M38 180L118 104L174 150L236 88L318 180Z" fill="#9eb6de" />
  </svg>
`)}`;
</script>

<template>
  <div class="xy-doc-image-demo">
    <div class="xy-doc-image-demo__panel">
      <div class="xy-doc-image-demo__meta">
        <span class="xy-doc-image-demo__kicker">Basic</span>
        <div>
          <h4>最小成本接入图片展示</h4>
          <p>适合卡片封面、结果页主视觉和资料区主图，直接用容器尺寸控制呈现即可。</p>
        </div>
      </div>

      <div class="xy-doc-image-demo__media">
        <xy-image
          :src="imageUrl"
          alt="项目封面"
          style="width: 320px; height: 196px; border-radius: 20px"
        />
      </div>
    </div>
  </div>
</template>
