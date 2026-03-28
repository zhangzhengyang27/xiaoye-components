<script setup lang="ts">
defineOptions({
  name: "XyDropdownItemImpl",
  inheritAttrs: false
});

import { computed, ref, useAttrs } from "vue";
import XyIcon from "../../icon";

const props = withDefaults(
  defineProps<{
    role: "menuitem" | "link";
    active?: boolean;
    disabled?: boolean;
    divided?: boolean;
    icon?: string;
    danger?: boolean;
    description?: string;
    textValue?: string;
    tabindex?: number;
  }>(),
  {
    active: false,
    disabled: false,
    divided: false,
    icon: "",
    danger: false,
    description: "",
    textValue: "",
    tabindex: -1
  }
);

defineSlots<{
  default?: () => unknown;
  icon?: () => unknown;
  description?: () => unknown;
}>();

const attrs = useAttrs();
const itemRef = ref<HTMLButtonElement | null>(null);

const rootClasses = computed(() => [
  "xy-dropdown__item-wrapper",
  props.divided ? "is-divided" : "",
  attrs.class
]);

const buttonClasses = computed(() => [
  "xy-dropdown__item",
  props.active ? "is-active" : "",
  props.disabled ? "is-disabled" : "",
  props.danger ? "is-danger" : ""
]);

const nativeAttrs = computed<Record<string, unknown>>(() => {
  const rest = { ...attrs };
  delete rest.class;
  delete rest.style;
  return rest;
});

defineExpose({
  itemRef
});
</script>

<template>
  <li :class="rootClasses" :style="attrs.style" role="none">
    <button
      ref="itemRef"
      type="button"
      :class="buttonClasses"
      :role="props.role"
      :tabindex="props.tabindex"
      :disabled="props.disabled"
      :aria-disabled="props.disabled ? 'true' : undefined"
      :data-text-value="props.textValue || undefined"
      v-bind="nativeAttrs"
    >
      <span v-if="$slots.icon || props.icon" class="xy-dropdown__item-icon" aria-hidden="true">
        <slot name="icon">
          <XyIcon :icon="props.icon" :size="14" />
        </slot>
      </span>

      <span class="xy-dropdown__item-content">
        <span class="xy-dropdown__item-label">
          <slot />
        </span>
        <small v-if="$slots.description || props.description" class="xy-dropdown__item-description">
          <slot name="description">
            {{ props.description }}
          </slot>
        </small>
      </span>
    </button>
  </li>
</template>
