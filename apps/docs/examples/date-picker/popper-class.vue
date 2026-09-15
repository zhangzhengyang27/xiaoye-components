<script setup lang="ts">
import { ref } from "vue";

const value = ref("2026-05-23");

const shortcuts = [
  { label: "今天", value: "2026-05-23" },
  { label: "本周一", value: "2026-05-19" },
  { label: "月初", value: "2026-05-01" }
];
</script>

<template>
  <div class="date-picker-popper-demo">
    <xy-date-picker
      v-model="value"
      clearable
      :shortcuts="shortcuts"
      popper-class="date-picker-admin-surface"
    />
  </div>
</template>

<style scoped>
.date-picker-popper-demo {
  max-width: 280px;
}

:global(.date-picker-admin-surface) {
  --xy-date-picker-panel-bg: color-mix(in srgb, var(--xy-bg-floating) 96%, var(--xy-bg-subtle));
  --xy-date-picker-panel-border: color-mix(
    in srgb,
    var(--xy-border-subtle) 82%,
    var(--xy-border)
  );
  --xy-date-picker-panel-shadow:
    0 0 0 1px color-mix(in srgb, var(--xy-bg-floating) 8%, transparent),
    0 16px 32px color-mix(in srgb, var(--xy-text-heading) 7%, transparent);
  --xy-date-picker-cell-hover-bg: color-mix(
    in srgb,
    var(--xy-brand) 8%,
    var(--xy-bg-floating)
  );
  --xy-date-picker-cell-selected-bg: color-mix(
    in srgb,
    var(--xy-brand) 14%,
    var(--xy-bg-floating)
  );
}
</style>
