<script setup lang="ts">
import { computed } from "vue";
import type { CSSProperties } from "vue";
import type { ComponentSize } from "@xiaoye/utils";
import { useConfig, useNamespace } from "@xiaoye/composables";
import type { DividerProps } from "./divider";

defineOptions({
  name: "XyDivider"
});

const props = withDefaults(defineProps<DividerProps>(), {
  direction: "horizontal",
  contentPosition: "center",
  borderStyle: "solid",
  size: undefined,
  status: "neutral"
});

const slots = defineSlots<{
  default?: () => unknown;
}>();

const { size: globalSize } = useConfig();
const ns = useNamespace("divider");

const mergedSize = computed<ComponentSize>(() => props.size ?? globalSize.value);
const hasContent = computed(() => props.direction === "horizontal" && Boolean(slots.default));

const dividerClasses = computed(() => [
  ns.base.value,
  `${ns.base.value}--${props.direction}`,
  `${ns.base.value}--${mergedSize.value}`,
  ns.is(props.status, true)
]);

const dividerStyle = computed<CSSProperties>(
  () =>
    ({
      [ns.cssVarBlock("border-style")]: props.borderStyle
    }) as CSSProperties
);
</script>

<template>
  <div
    :class="dividerClasses"
    :style="dividerStyle"
    role="separator"
    :aria-orientation="props.direction"
  >
    <div
      v-if="hasContent"
      :class="[`${ns.base.value}__text`, ns.is(props.contentPosition, true)]"
    >
      <slot />
    </div>
  </div>
</template>
