<script setup lang="ts">
import { ref } from "vue";

const value = ref(["north", "beijing", "haidian"]);

const options = [
  {
    label: "华北",
    value: "north",
    children: [
      {
        label: "北京",
        value: "beijing",
        children: [
          { label: "海淀区", value: "haidian" },
          { label: "朝阳区", value: "chaoyang" }
        ]
      },
      {
        label: "天津",
        value: "tianjin",
        children: [
          { label: "南开区", value: "nankai" },
          { label: "河西区", value: "hexi" }
        ]
      }
    ]
  },
  {
    label: "华东",
    value: "east",
    children: [
      {
        label: "上海",
        value: "shanghai",
        children: [
          { label: "浦东新区", value: "pudong" },
          { label: "徐汇区", value: "xuhui" }
        ]
      }
    ]
  }
];
</script>

<template>
  <div class="cascader-popper-demo">
    <xy-cascader
      v-model="value"
      :options="options"
      clearable
      filterable
      popper-class="cascader-admin-surface"
    />
  </div>
</template>

<style scoped>
.cascader-popper-demo {
  max-width: 340px;
}

:global(.cascader-admin-surface) {
  --xy-cascader-dropdown-bg: color-mix(
    in srgb,
    var(--xy-bg-color-floating) 96%,
    var(--xy-bg-color-subtle)
  );
  --xy-cascader-dropdown-border: color-mix(
    in srgb,
    var(--xy-border-color-subtle) 82%,
    var(--xy-border-color)
  );
  --xy-cascader-dropdown-shadow:
    0 0 0 1px color-mix(in srgb, var(--xy-bg-color-floating) 8%, transparent),
    0 14px 30px color-mix(in srgb, var(--xy-text-color-heading) 7%, transparent);
}
</style>
