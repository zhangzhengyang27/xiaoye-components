<template>
  <xy-tooltip
    trigger="click"
    placement="bottom-start"
    popper-class="tooltip-admin-surface"
    content="这里通过 popper-class 和实例级变量收口提示面板，而不是继续 deep 到内部类名。"
  >
    <xy-button plain>实例级样式收口</xy-button>
  </xy-tooltip>
</template>

<style scoped>
:global(.tooltip-admin-surface) {
  --xy-tooltip-bg: color-mix(in srgb, var(--xy-bg-color-floating) 94%, var(--xy-bg-color-subtle));
  --xy-tooltip-border: color-mix(
    in srgb,
    var(--xy-border-color-subtle) 82%,
    var(--xy-border-color)
  );
  --xy-tooltip-text: var(--xy-text-color-secondary);
  --xy-tooltip-shadow:
    0 0 0 1px color-mix(in srgb, var(--xy-bg-color-floating) 8%, transparent),
    0 10px 24px color-mix(in srgb, var(--xy-text-color-heading) 6%, transparent);
}
</style>
