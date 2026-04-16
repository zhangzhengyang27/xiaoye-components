<script setup lang="ts">
const content = ["小叶组件库", "Xiaoye Components"];
</script>

<template>
  <xy-watermark
    :content="content"
    :font="{
      color: 'color-mix(in srgb, var(--xy-text-color) 12%, transparent)',
      fontSize: 15,
      fontGap: 6
    }"
  >
    <section class="xy-doc-watermark-panel">
      <h4 class="xy-doc-watermark-panel__title">内部评审稿</h4>
      <p class="xy-doc-watermark-panel__description">
        多行模式适合把系统名、环境名和保密级别拆开表达，降低单行文字过长时的拥挤感。
      </p>
    </section>
  </xy-watermark>
</template>

<style scoped>
.xy-doc-watermark-panel {
  min-height: 220px;
  padding: 28px;
  border: 1px solid var(--xy-border-color-subtle);
  border-radius: var(--xy-radius-xl);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--xy-color-primary) 7%, white), transparent 52%),
    color-mix(in srgb, var(--xy-surface-sunken) 84%, white);
  color: var(--xy-text-color);
}

.xy-doc-watermark-panel__title {
  margin: 0 0 12px;
  font-size: 24px;
}

.xy-doc-watermark-panel__description {
  max-width: 520px;
  margin: 0;
  color: var(--xy-text-color-secondary);
  line-height: 1.7;
}
</style>
