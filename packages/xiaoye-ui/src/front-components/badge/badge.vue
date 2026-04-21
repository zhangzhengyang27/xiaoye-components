<script setup lang="ts">
import { computed } from "vue";
import type { BadgeProps } from "./badge";

const props = withDefaults(defineProps<BadgeProps>(), {
  value: "",
  max: 99,
  isDot: false,
  hidden: false,
  type: "danger",
  size: "md",
  showZero: true,
  color: ""
});

const slots = defineSlots<{
  default?: () => unknown;
  content?: (props: { value: string }) => unknown;
}>();

const ns = "xyu-badge";

const hasDefaultSlot = computed(() => Boolean(slots.default));

const displayValue = computed<string>(() => {
  if (props.isDot) return "";
  if (typeof props.value === "number" && typeof props.max === "number") {
    return props.max < props.value ? `${props.max}+` : `${props.value}`;
  }
  return `${props.value ?? ""}`;
});

const badgeClasses = computed(() => [
  `${ns}__content`,
  `${ns}__content--${props.type}`,
  `${ns}__content--${props.size}`,
  hasDefaultSlot.value ? "is-fixed" : "",
  props.isDot ? "is-dot" : "",
  !props.showZero && props.value === 0 ? "is-hidden-zero" : ""
]);

const badgeStyle = computed(() => {
  if (props.color) {
    return { backgroundColor: props.color };
  }
  return {};
});
</script>

<template>
  <div :class="[ns, hasDefaultSlot ? 'is-inherit' : '']">
    <slot />
    <transition name="xyu-zoom-in-center">
      <sup
        v-if="!props.hidden && (displayValue || props.isDot || slots.content)"
        :class="badgeClasses"
        :style="badgeStyle"
      >
        <slot name="content" :value="displayValue">
          {{ displayValue }}
        </slot>
      </sup>
    </transition>
  </div>
</template>
