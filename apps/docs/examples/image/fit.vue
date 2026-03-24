<script setup lang="ts">
const wideImage = `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180">
    <rect width="320" height="180" fill="#dbeafe" />
    <rect x="18" y="18" width="284" height="144" rx="24" fill="#1e293b" />
    <circle cx="104" cy="86" r="24" fill="#93c5fd" />
    <path d="M48 144L112 92L168 130L224 80L272 144Z" fill="#2563eb" />
  </svg>
`)}`;
</script>

<template>
  <div class="xy-doc-image-demo">
    <div class="xy-doc-image-demo__panel">
      <div class="xy-doc-image-demo__meta">
        <span class="xy-doc-image-demo__kicker">Fit</span>
        <div>
          <h4>同一张图在不同裁切模式下的呈现差异</h4>
          <p>适合在封面流、素材卡片和截图对比场景里快速判断哪种 `object-fit` 更合适。</p>
        </div>
      </div>

      <div class="xy-doc-image-fit-grid">
        <div class="xy-doc-image-fit-card">
          <div>
            <strong>Cover</strong>
            <p>优先铺满容器，常用于封面和横幅。</p>
          </div>
          <xy-image
            :src="wideImage"
            fit="cover"
            alt="cover"
            style="width: 100%; height: 120px; border-radius: 16px"
          />
        </div>

        <div class="xy-doc-image-fit-card">
          <div>
            <strong>Contain</strong>
            <p>完整保留内容，更适合截图和图表。</p>
          </div>
          <xy-image
            :src="wideImage"
            fit="contain"
            alt="contain"
            style="width: 100%; height: 120px; border-radius: 16px; background: #f8fafc"
          />
        </div>

        <div class="xy-doc-image-fit-card">
          <div>
            <strong>Fill</strong>
            <p>强制拉伸填满容器，适合占位对齐演示。</p>
          </div>
          <xy-image
            :src="wideImage"
            fit="fill"
            alt="fill"
            style="width: 100%; height: 120px; border-radius: 16px"
          />
        </div>
      </div>
    </div>
  </div>
</template>
