<script setup lang="ts">
import { computed, inject } from "vue";
import type { StepProps } from "./steps";

const props = withDefaults(defineProps<StepProps>(), {
  title: "",
  description: "",
  disabled: false
});

defineSlots<{
  icon?: () => unknown;
  title?: () => unknown;
  description?: () => unknown;
}>();

const ns = "xyu-steps";
const stepsDirection = inject<string>("stepsDirection", "horizontal");

const isLast = computed(() => false);
const lineInnerStyle = computed(() => ({ width: "0%" }));

const itemClasses = computed(() => [
  `${ns}__item`,
  props.status ? `is-${props.status}` : "",
  `is-${stepsDirection}`,
  isLast.value ? "is-last" : ""
]);
</script>

<template>
  <div :class="itemClasses">
    <div :class="`${ns}__head`">
      <div :class="[`${ns}__icon`, props.icon || slots.icon ? 'is-icon' : 'is-text']">
        <span v-if="slots.icon" :class="`${ns}__icon-inner`">
          <slot name="icon" />
        </span>
        <span v-else-if="props.status === 'success'" :class="`${ns}__icon-inner is-status`">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
        <span v-else-if="props.status === 'error'" :class="`${ns}__icon-inner is-status`">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </span>
        <span v-else :class="`${ns}__icon-inner-text`">
          <slot name="icon-inner" />
        </span>
      </div>
    </div>

    <div :class="`${ns}__line`">
      <span :class="`${ns}__line-inner`" :style="lineInnerStyle" />
    </div>

    <div :class="`${ns}__main`">
      <div :class="`${ns}__title`">
        <slot name="title">{{ props.title }}</slot>
      </div>
      <div v-if="props.description || slots.description" :class="`${ns}__description`">
        <slot name="description">{{ props.description }}</slot>
      </div>
    </div>
  </div>
</template>
