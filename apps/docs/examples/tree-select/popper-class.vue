<script setup lang="ts">
import { ref } from "vue";

const value = ref("ops");

const data = [
  {
    label: "运营中心",
    value: "ops",
    children: [
      { label: "内容审核", value: "ops-review" },
      { label: "活动投放", value: "ops-campaign" }
    ]
  },
  {
    label: "风控中心",
    value: "risk",
    children: [
      { label: "设备画像", value: "risk-device" },
      { label: "订单巡检", value: "risk-order" }
    ]
  }
];
</script>

<template>
  <div class="tree-select-popper-demo">
    <xy-tree-select
      v-model="value"
      :data="data"
      node-key="value"
      clearable
      filterable
      popper-class="tree-select-admin-surface"
    />
  </div>
</template>

<style scoped>
.tree-select-popper-demo {
  max-width: 320px;
}

:global(.tree-select-admin-surface) {
  --xy-tree-select-dropdown-bg: color-mix(
    in srgb,
    var(--xy-bg-color-floating) 96%,
    var(--xy-bg-color-subtle)
  );
  --xy-tree-select-dropdown-border: color-mix(
    in srgb,
    var(--xy-border-color-subtle) 82%,
    var(--xy-border-color)
  );
  --xy-tree-select-dropdown-shadow:
    0 0 0 1px color-mix(in srgb, var(--xy-bg-color-floating) 8%, transparent),
    0 14px 30px color-mix(in srgb, var(--xy-text-color-heading) 7%, transparent);
}
</style>
