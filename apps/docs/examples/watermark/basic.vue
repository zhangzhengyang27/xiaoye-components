<template>
  <xy-watermark>
    <section class="xy-doc-watermark-card">
      <span class="xy-doc-watermark-card__kicker">Preview</span>
      <h4>灰度环境工作台</h4>
      <p>直接把原有内容区包起来，就可以在不打断交互的前提下叠加环境标记和资料归属信息。</p>
    </section>
  </xy-watermark>
</template>

<style scoped>
.xy-doc-watermark-card {
  min-height: 240px;
  padding: 28px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 24px;
  background:
    linear-gradient(160deg, rgba(255, 255, 255, 0.96), rgba(241, 245, 249, 0.94)),
    radial-gradient(circle at top right, rgba(37, 99, 235, 0.12), transparent 42%);
  box-shadow: 0 24px 64px rgba(15, 23, 42, 0.08);
}

.xy-doc-watermark-card__kicker {
  display: inline-flex;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(37, 99, 235, 0.12);
  color: #1d4ed8;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.xy-doc-watermark-card h4 {
  margin: 18px 0 10px;
  color: #0f172a;
  font-size: 28px;
}

.xy-doc-watermark-card p {
  max-width: 520px;
  margin: 0;
  color: #475569;
  line-height: 1.7;
}
</style>
