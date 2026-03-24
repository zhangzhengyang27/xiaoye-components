<script setup lang="ts">
const images = [
  `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400">
      <rect width="640" height="400" fill="#0f766e" />
      <circle cx="180" cy="140" r="44" fill="#ecfeff" />
      <path d="M60 320L184 156L304 256L420 138L578 320Z" fill="#ccfbf1" />
    </svg>
  `)}`,
  `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400">
      <rect width="640" height="400" fill="#1d4ed8" />
      <rect x="72" y="72" width="496" height="256" rx="36" fill="#bfdbfe" />
      <circle cx="196" cy="184" r="40" fill="#eff6ff" />
      <path d="M112 296L210 198L314 270L430 160L528 296Z" fill="#2563eb" />
    </svg>
  `)}`
];
</script>

<template>
  <div class="xy-doc-image-demo">
    <div class="xy-doc-image-demo__panel">
      <div class="xy-doc-image-demo__meta">
        <span class="xy-doc-image-demo__kicker">Custom</span>
        <div>
          <h4>把预览层接成更完整的业务操作台</h4>
          <p>自定义工具栏更适合素材审核、设计评审和带操作语义的查看流程。</p>
        </div>
      </div>

      <div class="xy-doc-image-demo__media">
        <xy-image
          :src="images[0]"
          :preview-src-list="images"
          :zoom-rate="1.35"
          show-progress
          hide-on-click-modal
          alt="支持自定义预览工具栏"
          style="width: 320px; height: 196px; border-radius: 20px"
        >
          <template #progress="{ activeIndex, total }">
            <div class="xy-doc-image-progress">
              <span class="xy-doc-image-progress__label">Gallery</span>
              <strong>{{ activeIndex + 1 }} / {{ total }}</strong>
            </div>
          </template>

          <template #toolbar="{ actions, reset }">
            <div class="xy-doc-image-toolbar">
              <button
                type="button"
                class="xy-doc-image-toolbar__button"
                aria-label="缩小"
                @click="actions('zoomOut')"
              >
                <xy-icon icon="mdi:magnify-minus-outline" :size="18" />
              </button>
              <button
                type="button"
                class="xy-doc-image-toolbar__button"
                aria-label="放大"
                @click="actions('zoomIn')"
              >
                <xy-icon icon="mdi:magnify-plus-outline" :size="18" />
              </button>
              <span class="xy-doc-image-toolbar__divider" />
              <button
                type="button"
                class="xy-doc-image-toolbar__button"
                aria-label="切换模式"
                @click="actions('toggleMode')"
              >
                <xy-icon icon="mdi:fit-to-screen-outline" :size="18" />
              </button>
              <button
                type="button"
                class="xy-doc-image-toolbar__button"
                aria-label="顺时针旋转"
                @click="actions('clockwise')"
              >
                <xy-icon icon="mdi:rotate-right" :size="18" />
              </button>
              <span class="xy-doc-image-toolbar__divider" />
              <button
                type="button"
                class="xy-doc-image-toolbar__button xy-doc-image-toolbar__button--accent"
                aria-label="重置视图"
                @click="reset()"
              >
                <xy-icon icon="mdi:restore" :size="18" />
              </button>
            </div>
          </template>
        </xy-image>
      </div>
    </div>

    <div class="xy-doc-image-demo__notes">
      <div class="xy-doc-image-note">
        <span class="xy-doc-image-note__title">何时自定义</span>
        <p>当预览层不只是“看图”，而是要承接审核、比对、旋转或重置这类动作时。</p>
      </div>
      <div class="xy-doc-image-note">
        <span class="xy-doc-image-note__title">建议控制</span>
        <p>优先保留 4-6 个高频动作，避免工具栏过长影响图片主体的阅读体验。</p>
      </div>
    </div>
  </div>
</template>
