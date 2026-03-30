<script setup lang="ts">
import { computed, inject } from "vue";
import { useNamespace } from "@xiaoye/composables";
import { descriptionsKey } from "./context";

export interface DescriptionsItemProps {
  label?: string;
  span?: number;
  className?: string;
  labelClassName?: string;
  contentClassName?: string;
}

const props = withDefaults(defineProps<DescriptionsItemProps>(), {
  label: "",
  span: 1,
  className: "",
  labelClassName: "",
  contentClassName: ""
});

const ns = useNamespace("descriptions-item");
const descriptions = inject(descriptionsKey, null);
const labelStyle = computed(() =>
  descriptions?.labelWidth.value ? { width: `${descriptions.labelWidth.value}` } : undefined
);
</script>

<template>
  <div
    :class="[
      ns.base.value,
      props.className,
      descriptions?.border.value ? 'is-bordered' : '',
      `is-${descriptions?.direction.value ?? 'horizontal'}`
    ]"
    :style="{ gridColumn: `span ${Math.max(props.span, 1)} / span ${Math.max(props.span, 1)}` }"
  >
    <div :class="['xy-descriptions-item__label', props.labelClassName]" :style="labelStyle">
      <slot name="label">{{ props.label }}</slot>
    </div>
    <div :class="['xy-descriptions-item__content', props.contentClassName]">
      <slot />
    </div>
  </div>
</template>
