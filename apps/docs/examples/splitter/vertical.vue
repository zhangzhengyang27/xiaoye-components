<template>
  <div class="demo-splitter-vertical">
    <xy-splitter layout="vertical">
      <xy-splitter-panel size="44%" min="120px">
        <section class="demo-splitter-card">
          <xy-text tag="strong">待处理队列</xy-text>
          <xy-text size="sm" type="info">纵向布局适合上下分区的控制台、日志视图和预览面板。</xy-text>
        </section>
      </xy-splitter-panel>

      <xy-splitter-panel min="160px">
        <section class="demo-splitter-card demo-splitter-card--strong">
          <xy-text tag="strong">实时日志</xy-text>
          <xy-text tag="p" size="sm">
            这里通常会放日志流、任务时间线或 SQL 结果窗口。
          </xy-text>
        </section>
      </xy-splitter-panel>
    </xy-splitter>
  </div>
</template>

<style scoped>
.demo-splitter-vertical {
  height: 320px;
  border: 1px solid color-mix(in srgb, var(--xy-border-color) 88%, white);
  border-radius: 24px;
  overflow: hidden;
  background: var(--xy-bg-color);
}

.demo-splitter-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  background: color-mix(in srgb, var(--xy-bg-color-muted) 82%, white);
}

.demo-splitter-card--strong {
  background:
    linear-gradient(
      180deg,
      color-mix(in srgb, var(--xy-color-primary) 8%, white),
      transparent 46%
    ),
    color-mix(in srgb, var(--xy-bg-color-muted) 78%, white);
}
</style>
