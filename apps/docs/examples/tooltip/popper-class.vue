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
  --xy-tooltip-bg: color-mix(in srgb, var(--xy-bg-floating) 94%, var(--xy-bg-subtle));
  --xy-tooltip-border: color-mix(
    in srgb,
    var(--xy-border-subtle) 82%,
    var(--xy-border)
  );
  --xy-tooltip-text: var(--xy-text-secondary);
  --xy-tooltip-shadow:
    0 0 0 1px color-mix(in srgb, var(--xy-bg-floating) 8%, transparent),
    0 10px 24px color-mix(in srgb, var(--xy-text-heading) 6%, transparent);
}
</style>
