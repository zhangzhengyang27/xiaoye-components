<script setup lang="ts">
import { computed, inject, useSlots } from "vue";
import type { StepProps } from "./steps";
import XyuIcon from "../icon/icon.vue";

defineOptions({ name: "XyuStep" });

const props = withDefaults(defineProps<StepProps>(), {
  title: "",
  description: "",
  disabled: false
});

const slots = useSlots();

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
        <XyuIcon v-else-if="props.status === 'success'" icon="mdi:check" :size="14" class="is-status" />
        <XyuIcon v-else-if="props.status === 'error'" icon="mdi:close" :size="14" class="is-status" />
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
