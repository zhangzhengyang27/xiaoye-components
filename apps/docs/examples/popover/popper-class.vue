<template>
  <xy-popover
    placement="bottom-start"
    :width="320"
    popper-class="popover-admin-surface"
  >
    <template #trigger>
      <xy-button plain>实例级样式收口</xy-button>
    </template>
    <template #header>
      <xy-space size="8">
        <xy-tag status="primary">轻交互卡片</xy-tag>
        <strong>筛选补充说明</strong>
      </xy-space>
    </template>
    <div class="xy-doc-stack">
      <p>这里通过 popper-class 和实例级变量收口卡片面板，而不是继续 deep 到 header 或 content 的内部类名。</p>
      <xy-button type="primary" size="sm">知道了</xy-button>
    </div>
  </xy-popover>
</template>

<style scoped>
:global(.popover-admin-surface) {
  --xy-popover-bg: color-mix(in srgb, var(--xy-bg-color-floating) 96%, var(--xy-bg-color-subtle));
  --xy-popover-border: color-mix(
    in srgb,
    var(--xy-border-color-subtle) 82%,
    var(--xy-border-color)
  );
  --xy-popover-shadow:
    0 0 0 1px color-mix(in srgb, var(--xy-bg-color-floating) 8%, transparent),
    0 14px 30px color-mix(in srgb, var(--xy-text-color-heading) 7%, transparent);
  --xy-popover-title: var(--xy-text-color-primary);
  --xy-popover-text: var(--xy-text-color-secondary);
}
</style>
