<script setup lang="ts">
import { ref } from "vue";

const value = ref("");

const options = [
  { label: "订单异常", value: "订单异常" },
  { label: "退款待审核", value: "退款待审核" },
  { label: "高风险设备", value: "高风险设备" }
];
</script>

<template>
  <div class="auto-complete-popper-demo">
    <xy-auto-complete
      v-model="value"
      :options="options"
      clearable
      placeholder="搜索后台异常项"
      popper-class="auto-complete-admin-surface"
      :dropdown-min-width="280"
    />
  </div>
</template>

<style scoped>
.auto-complete-popper-demo {
  max-width: 320px;
}

:global(.auto-complete-admin-surface) {
  --xy-auto-complete-dropdown-bg: color-mix(
    in srgb,
    var(--xy-bg-color-floating) 96%,
    var(--xy-bg-color-subtle)
  );
  --xy-auto-complete-dropdown-border: color-mix(
    in srgb,
    var(--xy-border-color-subtle) 80%,
    var(--xy-border-color)
  );
  --xy-auto-complete-dropdown-shadow:
    0 0 0 1px color-mix(in srgb, var(--xy-bg-color-floating) 10%, transparent),
    0 14px 30px color-mix(in srgb, var(--xy-text-color-heading) 7%, transparent);
}
</style>
