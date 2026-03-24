<script setup lang="ts">
import { computed } from "vue";
import type { StyleValue } from "vue";
import { useNamespace } from "@xiaoye/composables";
import type { BadgeProps } from "./badge";

const props = withDefaults(defineProps<BadgeProps>(), {
  value: "",
  max: 99,
  isDot: false,
  hidden: false,
  type: "danger",
  showZero: true,
  color: "",
  badgeStyle: undefined,
  offset: () => [0, 0],
  badgeClass: ""
});

const slots = defineSlots<{
  default?: () => unknown;
  content?: (props: { value: string }) => unknown;
}>();

const ns = useNamespace("badge");
const hasDefaultSlot = computed(() => Boolean(slots.default));

const content = computed<string>(() => {
  if (props.isDot) {
    return "";
  }

  if (typeof props.value === "number" && typeof props.max === "number") {
    return props.max < props.value ? `${props.max}+` : `${props.value}`;
  }

  return `${props.value}`;
});

const style = computed<StyleValue>(() => [
  {
    backgroundColor: props.color || undefined,
    marginRight: `${-props.offset[0]}px`,
    marginTop: `${props.offset[1]}px`
  },
  props.badgeStyle ?? {}
]);

defineExpose({
  content
});
</script>

<template>
  <div :class="ns.base.value">
    <slot />
    <transition name="xy-zoom-in-center">
      <sup
        v-if="!props.hidden && (content || props.isDot || slots.content)"
        :class="[
          `${ns.base.value}__content`,
          `${ns.base.value}__content--${props.type}`,
          ns.is('fixed', hasDefaultSlot),
          ns.is('dot', props.isDot),
          ns.is('hide-zero', !props.showZero && props.value === 0),
          props.badgeClass
        ]"
        :style="style"
      >
        <slot name="content" :value="content">
          {{ content }}
        </slot>
      </sup>
    </transition>
  </div>
</template>
