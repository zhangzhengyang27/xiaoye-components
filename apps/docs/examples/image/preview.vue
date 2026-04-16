<script setup lang="ts">
const images = [
  `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400">
      <rect width="640" height="400" fill="#dce7e1" />
      <circle cx="180" cy="140" r="44" fill="#f7fbfa" />
      <path d="M60 320L184 156L304 256L420 138L578 320Z" fill="#9fb8ae" />
    </svg>
  `)}`,
  `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400">
      <rect width="640" height="400" fill="#dce6f5" />
      <rect x="72" y="72" width="496" height="256" rx="36" fill="#eef3fb" />
      <circle cx="196" cy="184" r="40" fill="#fbfcff" />
      <path d="M112 296L210 198L314 270L430 160L528 296Z" fill="#8fa7cb" />
    </svg>
  `)}`,
  `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400">
      <rect width="640" height="400" fill="#e7e0f0" />
      <rect x="88" y="88" width="464" height="224" rx="30" fill="#f3eef8" />
      <circle cx="220" cy="188" r="38" fill="#fcfaff" />
      <path d="M132 292L226 206L328 272L438 176L510 292Z" fill="#a690be" />
    </svg>
  `)}`
];
</script>

<template>
  <div class="xy-doc-image-demo">
    <div class="xy-doc-image-demo__panel">
      <div class="xy-doc-image-demo__meta">
        <span class="xy-doc-image-demo__kicker">Preview</span>
        <div>
          <h4>点击主图进入预览层</h4>
          <p>默认预览适合文档截图、详情页大图和素材查看场景。</p>
        </div>
      </div>

      <div class="xy-doc-image-demo__media">
        <xy-image
          :src="images[0]"
          :preview-src-list="images"
          :initial-index="1"
          show-progress
          hide-on-click-modal
          alt="可预览图片"
          style="width: 320px; height: 196px; border-radius: 20px"
        />
      </div>
    </div>

    <div class="xy-doc-image-demo__thumbs">
      <button
        v-for="(image, index) in images"
        :key="index"
        type="button"
        class="xy-doc-image-demo__thumb"
      >
        <xy-image
          :src="image"
          :preview-src-list="images"
          :initial-index="index"
          alt="预览缩略图"
          style="width: 88px; height: 56px; border-radius: 14px"
        />
      </button>
    </div>
  </div>
</template>
