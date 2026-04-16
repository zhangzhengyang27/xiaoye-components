<template>
  <xy-watermark>
    <section class="xy-doc-watermark-card">
      <span class="xy-doc-watermark-card__kicker">Preview</span>
      <h4 class="xy-doc-watermark-card__title">灰度环境工作台</h4>
      <p class="xy-doc-watermark-card__description">
        直接把原有内容区包起来，就可以在不打断交互的前提下叠加环境标记和资料归属信息。
      </p>
    </section>
  </xy-watermark>
</template>

<style scoped>
.xy-doc-watermark-card {
  min-height: 240px;
  padding: 28px;
  border: 1px solid var(--xy-border-color-subtle);
  border-radius: var(--xy-radius-xl);
  background: linear-gradient(
    160deg,
    var(--xy-surface-raised),
    color-mix(in srgb, var(--xy-bg-color-subtle) 88%, white)
  );
  box-shadow: var(--xy-shadow-card);
}

.xy-doc-watermark-card__kicker {
  display: inline-flex;
  padding: 6px 12px;
  border-radius: 999px;
  background: var(--xy-color-primary-soft);
  color: var(--xy-color-primary);
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.xy-doc-watermark-card__title {
  margin: 18px 0 10px;
  color: var(--xy-text-color-heading);
  font-size: 28px;
}

.xy-doc-watermark-card__description {
  max-width: 520px;
  margin: 0;
  color: var(--xy-text-color-secondary);
  line-height: 1.7;
}
</style>
