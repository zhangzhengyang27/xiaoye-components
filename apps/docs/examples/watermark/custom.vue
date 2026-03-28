<script setup lang="ts">
import { reactive } from "vue";

const config = reactive({
  content: "Xiaoye Components",
  font: {
    color: "rgba(15, 23, 42, 0.14)",
    fontSize: 16
  },
  zIndex: 9,
  rotate: -22,
  gap: [120, 96] as [number, number],
  offset: [60, 48] as [number, number]
});
</script>

<template>
  <div class="xy-doc-watermark-playground">
    <xy-watermark
      class="xy-doc-watermark-playground__preview"
      :content="config.content"
      :font="config.font"
      :z-index="config.zIndex"
      :rotate="config.rotate"
      :gap="config.gap"
      :offset="config.offset"
    >
      <section class="xy-doc-watermark-playground__surface">
        <span class="xy-doc-watermark-playground__status">Trial</span>
        <h4>自定义水印参数面板</h4>
        <p>适合在灰度环境、内部演示环境或试用环境里快速确认水印密度、角度和字体强度。</p>
      </section>
    </xy-watermark>

    <xy-form class="xy-doc-watermark-playground__form" :model="config" label-position="top">
      <xy-form-item label="Content">
        <xy-input v-model="config.content" placeholder="请输入水印文案" />
      </xy-form-item>

      <xy-form-item label="Color">
        <xy-input v-model="config.font.color" placeholder="例如 rgba(15, 23, 42, 0.14)" />
      </xy-form-item>

      <xy-form-item label="Font Size">
        <xy-slider v-model="config.font.fontSize" :min="12" :max="28" show-input />
      </xy-form-item>

      <xy-form-item label="z-index">
        <xy-slider v-model="config.zIndex" :min="0" :max="20" show-input />
      </xy-form-item>

      <xy-form-item label="Rotate">
        <xy-slider v-model="config.rotate" :min="-180" :max="180" show-input />
      </xy-form-item>

      <xy-form-item label="Gap">
        <xy-space style="width: 100%;">
          <xy-input-number v-model="config.gap[0]" controls-position="right" :min="0" />
          <xy-input-number v-model="config.gap[1]" controls-position="right" :min="0" />
        </xy-space>
      </xy-form-item>

      <xy-form-item label="Offset">
        <xy-space style="width: 100%;">
          <xy-input-number v-model="config.offset[0]" controls-position="right" :min="0" />
          <xy-input-number v-model="config.offset[1]" controls-position="right" :min="0" />
        </xy-space>
      </xy-form-item>
    </xy-form>
  </div>
</template>

<style scoped>
.xy-doc-watermark-playground {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(280px, 360px);
  gap: 20px;
}

.xy-doc-watermark-playground__preview {
  min-width: 0;
}

.xy-doc-watermark-playground__surface {
  min-height: 320px;
  padding: 28px;
  border-radius: 28px;
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.96), rgba(241, 245, 249, 0.94)),
    radial-gradient(circle at top right, rgba(37, 99, 235, 0.14), transparent 38%);
  box-shadow: 0 24px 72px rgba(15, 23, 42, 0.08);
}

.xy-doc-watermark-playground__status {
  display: inline-flex;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(14, 165, 233, 0.14);
  color: #0369a1;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.xy-doc-watermark-playground__surface h4 {
  margin: 18px 0 12px;
  color: #0f172a;
  font-size: 28px;
}

.xy-doc-watermark-playground__surface p {
  max-width: 520px;
  margin: 0;
  color: #475569;
  line-height: 1.7;
}

.xy-doc-watermark-playground__form {
  padding: 20px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 24px;
  background: rgba(248, 250, 252, 0.92);
}

@media (max-width: 960px) {
  .xy-doc-watermark-playground {
    grid-template-columns: 1fr;
  }
}
</style>
