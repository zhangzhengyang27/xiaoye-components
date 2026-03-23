<script setup lang="ts">
import { provide, toRef } from "vue";
import { useNamespace } from "@xiaoye/composables";
import type { ButtonGroupProps } from "./button-group";
import { buttonGroupContextKey } from "./constants";

const props = withDefaults(defineProps<ButtonGroupProps>(), {
  direction: "horizontal"
});

const ns = useNamespace("button");

provide(buttonGroupContextKey, {
  size: toRef(props, "size"),
  type: toRef(props, "type")
});
</script>

<template>
  <div :class="[`${ns.base.value}-group`, `${ns.base.value}-group--${props.direction}`]">
    <slot />
  </div>
</template>
