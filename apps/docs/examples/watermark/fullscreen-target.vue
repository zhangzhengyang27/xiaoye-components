<script setup lang="ts">
import { ref } from "vue";

const fullscreen = ref(false);
</script>

<template>
  <div class="xy-doc-watermark-host-grid">
    <div class="xy-doc-watermark-host-grid__cell">
      <xy-watermark
        target=".xy-doc-watermark-target-host"
        content="TARGET HOST"
        :opacity="0.12"
        :repeat="'repeat-y'"
      >
        <section class="xy-doc-watermark-helper">
          <h4 class="xy-doc-watermark-helper__title">Target 模式</h4>
          <p class="xy-doc-watermark-helper__description">
            组件声明在左侧，但水印实际会挂到右侧目标容器。slot 只负责说明，不决定宿主。
          </p>
        </section>
      </xy-watermark>
    </div>

    <section class="xy-doc-watermark-target-host xy-doc-watermark-host-grid__cell">
      <span class="xy-doc-watermark-host-grid__badge">External Host</span>
      <h4 class="xy-doc-watermark-target-host__title">右侧是实际水印宿主</h4>
      <p class="xy-doc-watermark-target-host__description">
        适合对接外部面板、预览区或业务容器，而不必改动组件声明所在的位置。
      </p>
    </section>
  </div>

  <div class="xy-doc-watermark-fullscreen-demo">
    <xy-watermark
      :fullscreen="fullscreen"
      content="FULLSCREEN WATERMARK"
      :opacity="0.1"
      :repeat="'repeat'"
    >
      <section class="xy-doc-watermark-fullscreen-demo__surface">
        <xy-space wrap>
          <xy-switch v-model="fullscreen" active-text="关闭全屏水印" inactive-text="开启全屏水印" />
          <xy-tag status="primary">{{ fullscreen ? "已覆盖 body" : "仅示例区域" }}</xy-tag>
        </xy-space>
        <p class="xy-doc-watermark-fullscreen-demo__description">
          全屏模式会把水印层直接挂到 `document.body`，适合试用环境、演示环境和页面级品牌标记。
        </p>
      </section>
    </xy-watermark>
  </div>
</template>

<style scoped>
.xy-doc-watermark-host-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.xy-doc-watermark-host-grid__cell {
  min-width: 0;
}

.xy-doc-watermark-helper,
.xy-doc-watermark-target-host,
.xy-doc-watermark-fullscreen-demo__surface {
  min-height: 220px;
  padding: 26px;
  border: 1px solid var(--xy-border-color-subtle);
  border-radius: var(--xy-radius-xl);
  background: linear-gradient(
    160deg,
    var(--xy-surface-raised),
    color-mix(in srgb, var(--xy-bg-color-subtle) 88%, white)
  );
  box-shadow: var(--xy-shadow-card);
}

.xy-doc-watermark-host-grid__badge {
  display: inline-flex;
  padding: 6px 12px;
  border-radius: 999px;
  background: var(--xy-color-primary-soft);
  color: var(--xy-color-primary);
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.xy-doc-watermark-helper__title,
.xy-doc-watermark-target-host__title {
  margin: 0 0 12px;
  color: var(--xy-text-color-heading);
  font-size: 24px;
}

.xy-doc-watermark-helper__description,
.xy-doc-watermark-target-host__description,
.xy-doc-watermark-fullscreen-demo__description {
  margin: 0;
  color: var(--xy-text-color-secondary);
  line-height: 1.7;
}

.xy-doc-watermark-fullscreen-demo {
  margin-top: 18px;
}

@media (max-width: 960px) {
  .xy-doc-watermark-host-grid {
    grid-template-columns: 1fr;
  }
}
</style>
