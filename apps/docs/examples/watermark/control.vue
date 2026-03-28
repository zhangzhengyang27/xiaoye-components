<script setup lang="ts">
import { reactive, ref } from "vue";

const controlHostRef = ref<HTMLElement | null>(null);
const repeatOptions = ["repeat", "repeat-x", "repeat-y", "no-repeat"] as const;

const config = reactive({
  disabled: false,
  autoObserve: true,
  opacity: 0.18,
  repeat: "repeat" as (typeof repeatOptions)[number]
});

function removeLayer() {
  controlHostRef.value?.querySelector(".xy-watermark__layer")?.remove();
}
</script>

<template>
  <div class="xy-doc-watermark-control">
    <div ref="controlHostRef">
      <xy-watermark
        content="CONTROL MODE"
        :disabled="config.disabled"
        :auto-observe="config.autoObserve"
        :opacity="config.opacity"
        :repeat="config.repeat"
      >
        <section class="xy-doc-watermark-control__surface">
          <span class="xy-doc-watermark-control__badge">Control</span>
          <h4>控制型参数</h4>
          <p>适合在调试、导出预览和灰度环境里快速开关水印、调整透明度，或验证自动恢复能力是否符合预期。</p>
        </section>
      </xy-watermark>
    </div>

    <div class="xy-doc-watermark-control__panel">
      <xy-space wrap>
        <xy-switch v-model="config.disabled" active-text="禁用" inactive-text="启用" />
        <xy-switch
          v-model="config.autoObserve"
          active-text="自动恢复"
          inactive-text="不恢复"
        />
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
  border-radius: 24px;
  background:
    linear-gradient(155deg, rgba(255, 255, 255, 0.96), rgba(241, 245, 249, 0.92)),
    radial-gradient(circle at top right, rgba(14, 165, 233, 0.12), transparent 38%);
  box-shadow: 0 24px 64px rgba(15, 23, 42, 0.08);
}

.xy-doc-watermark-control__badge {
  display: inline-flex;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(37, 99, 235, 0.12);
  color: #1d4ed8;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.xy-doc-watermark-control__surface h4 {
  margin: 18px 0 12px;
  color: #0f172a;
  font-size: 28px;
}

.xy-doc-watermark-control__surface p {
  max-width: 560px;
  margin: 0;
  color: #475569;
  line-height: 1.7;
}

.xy-doc-watermark-control__panel {
  padding: 20px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 20px;
  background: rgba(248, 250, 252, 0.92);
}
</style>
