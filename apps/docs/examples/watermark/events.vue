<script setup lang="ts">
import { computed, ref } from "vue";
import type { WatermarkInstance, WatermarkRenderPayload } from "xiaoye-components";

const watermarkRef = ref<WatermarkInstance | null>(null);
const broken = ref(false);
const lastRendered = ref<WatermarkRenderPayload | null>(null);
const imageErrorCount = ref(0);
const dataUrlPreview = ref("尚未生成");

const logoImage = `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="240" height="72" viewBox="0 0 240 72">
    <rect width="240" height="72" rx="18" fill="#0f766e" opacity="0.92" />
    <path d="M24 36H92M104 36H168M180 36H216" stroke="#ecfeff" stroke-width="10" stroke-linecap="round" />
  </svg>
`)}`;

const image = computed(() => (broken.value ? "broken-image" : logoImage));

function handleRendered(payload: WatermarkRenderPayload) {
  lastRendered.value = payload;
  dataUrlPreview.value = payload.dataUrl.slice(0, 28);
}

function handleImageError() {
  imageErrorCount.value += 1;
}

function readCurrentDataUrl() {
  dataUrlPreview.value = watermarkRef.value?.getDataUrl()?.slice(0, 28) ?? "当前为空";
}
</script>

<template>
  <div class="xy-doc-watermark-events">
    <xy-watermark
      ref="watermarkRef"
      :image="image"
      content="EVENT FALLBACK"
      :width="120"
      :height="36"
      @rendered="handleRendered"
      @image-error="handleImageError"
    >
      <section class="xy-doc-watermark-events__surface">
        <span class="xy-doc-watermark-events__badge">Events</span>
        <h4>渲染回调与 expose</h4>
        <p>适合在截图、导出或运行时调试里记录当前水印来源，并在图片失败时回退到文本模式。</p>
      </section>
    </xy-watermark>

    <div class="xy-doc-watermark-events__panel">
      <xy-space wrap>
        <xy-button type="primary" @click="broken = !broken">
          {{ broken ? "切回正常图片" : "模拟图片失败" }}
        </xy-button>
        <xy-button @click="watermarkRef?.rerender()">手动 rerender</xy-button>
        <xy-button @click="readCurrentDataUrl">读取 dataUrl</xy-button>
      </xy-space>

      <xy-space wrap>
        <xy-tag status="primary">rendered：{{ lastRendered?.source ?? "未触发" }}</xy-tag>
        <xy-tag :status="imageErrorCount > 0 ? 'warning' : 'success'">
          image-error：{{ imageErrorCount }}
        </xy-tag>
        <xy-tag status="info">dataUrl：{{ dataUrlPreview }}</xy-tag>
      </xy-space>
    </div>
  </div>
</template>

<style scoped>
.xy-doc-watermark-events {
  display: grid;
  gap: 18px;
}

.xy-doc-watermark-events__surface {
  min-height: 220px;
  padding: 28px;
  border-radius: 24px;
  background:
    linear-gradient(180deg, rgba(15, 23, 42, 0.92), rgba(30, 41, 59, 0.9)),
    radial-gradient(circle at top right, rgba(45, 212, 191, 0.12), transparent 36%);
  color: rgba(248, 250, 252, 0.92);
}

.xy-doc-watermark-events__badge {
  display: inline-flex;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(45, 212, 191, 0.14);
  color: #99f6e4;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.xy-doc-watermark-events__surface h4 {
  margin: 18px 0 12px;
  font-size: 28px;
}

.xy-doc-watermark-events__surface p {
  max-width: 560px;
  margin: 0;
  line-height: 1.7;
}

.xy-doc-watermark-events__panel {
  display: grid;
  gap: 14px;
  padding: 20px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 20px;
  background: rgba(248, 250, 252, 0.92);
}
</style>
