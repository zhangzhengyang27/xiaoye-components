<script setup lang="ts">
import type { WatermarkInstance } from "xiaoye-components";
import { reactive, ref } from "vue";

const watermarkRef = ref<WatermarkInstance | null>(null);
const repeatOptions = ["repeat", "repeat-x", "repeat-y", "no-repeat"] as const;

const config = reactive({
  disabled: false,
  autoObserve: true,
  opacity: 0.18,
  repeat: "repeat" as (typeof repeatOptions)[number]
});

function removeLayer() {
  watermarkRef.value?.removeWatermark();
}
</script>

<template>
  <div class="xy-doc-watermark-control">
    <xy-watermark
      ref="watermarkRef"
      content="CONTROL MODE"
      :disabled="config.disabled"
      :auto-observe="config.autoObserve"
      :opacity="config.opacity"
      :repeat="config.repeat"
    >
      <section class="xy-doc-watermark-control__surface">
        <span class="xy-doc-watermark-control__badge">Control</span>
        <h4 class="xy-doc-watermark-control__title">控制型参数</h4>
        <p class="xy-doc-watermark-control__description">
          适合在调试、导出预览和灰度环境里快速开关水印、调整透明度，或验证自动恢复能力是否符合预期。
        </p>
      </section>
    </xy-watermark>

    <div class="xy-doc-watermark-control__panel">
      <xy-space wrap>
        <xy-switch v-model="config.disabled" active-text="禁用" inactive-text="启用" />
        <xy-switch v-model="config.autoObserve" active-text="自动恢复" inactive-text="不恢复" />
        <xy-button @click="removeLayer">移除当前水印层</xy-button>
      </xy-space>

      <xy-form :model="config" label-position="top">
        <xy-form-item label="Opacity">
          <xy-slider v-model="config.opacity" :min="0" :max="1" :step="0.05" show-input />
        </xy-form-item>
      </xy-form>

      <xy-space wrap>
        <xy-button
          v-for="option in repeatOptions"
          :key="option"
          :type="config.repeat === option ? 'primary' : 'default'"
          @click="config.repeat = option"
        >
          {{ option }}
        </xy-button>
      </xy-space>
    </div>
  </div>
</template>

<style scoped>
.xy-doc-watermark-control {
  display: grid;
  gap: 18px;
}

.xy-doc-watermark-control__surface {
  min-height: 240px;
  padding: 28px;
  border: 1px solid var(--xy-border-color-subtle);
  border-radius: var(--xy-radius-xl);
  background: linear-gradient(
    155deg,
    var(--xy-surface-raised),
    color-mix(in srgb, var(--xy-bg-color-subtle) 86%, white)
  );
  box-shadow: var(--xy-shadow-card);
}

.xy-doc-watermark-control__badge {
  display: inline-flex;
  padding: 6px 12px;
  border-radius: 999px;
  background: var(--xy-color-primary-soft);
  color: var(--xy-color-primary);
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.xy-doc-watermark-control__title {
  margin: 18px 0 12px;
  color: var(--xy-text-color-heading);
  font-size: 28px;
}

.xy-doc-watermark-control__description {
  max-width: 560px;
  margin: 0;
  color: var(--xy-text-color-secondary);
  line-height: 1.7;
}

.xy-doc-watermark-control__panel {
  padding: 20px;
  border: 1px solid var(--xy-border-color-subtle);
  border-radius: var(--xy-radius-lg);
  background: color-mix(in srgb, var(--xy-bg-color-subtle) 92%, white);
}
</style>
