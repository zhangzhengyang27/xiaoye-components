<script setup lang="ts">
import type { ComponentSize, ComponentStatus } from "@xiaoye/utils";
import { useConfig, useNamespace } from "@xiaoye/composables";
import { computed, useSlots } from "vue";
import XyIcon from "../../icon";

export interface TagProps {
  status?: ComponentStatus;
  size?: ComponentSize;
  round?: boolean;
  closable?: boolean;
  icon?: string;
}

const props = withDefaults(defineProps<TagProps>(), {
  status: "neutral",
  size: undefined,
  round: false,
  closable: false,
  icon: ""
});

const emit = defineEmits<{
  close: [event: MouseEvent];
}>();

const { size: globalSize } = useConfig();
const slots = useSlots();
const ns = useNamespace("tag");
const mergedSize = computed(() => props.size ?? globalSize.value);
const iconSizeMap = {
  sm: 12,
  md: 14,
  lg: 16
} as const;
const closeIconSizeMap = {
  sm: 10,
  md: 12,
  lg: 12
} as const;

const hasIcon = computed(() => Boolean(props.icon) || Boolean(slots.icon));
const iconSize = computed(() => iconSizeMap[mergedSize.value]);
const closeIconSize = computed(() => closeIconSizeMap[mergedSize.value]);
</script>

<template>
  <span
    :class="[
      ns.base.value,
      `${ns.base.value}--${props.status}`,
      `${ns.base.value}--${mergedSize}`,
      ns.is('round', props.round),
      ns.is('closable', props.closable),
      ns.is('with-icon', hasIcon)
    ]"
  >
    <span class="xy-tag__content">
      <span v-if="hasIcon" class="xy-tag__icon" aria-hidden="true">
        <XyIcon v-if="props.icon" :icon="props.icon" :size="iconSize" />
        <slot v-else name="icon" />
      </span>
      <slot />
    </span>
    <button
      v-if="props.closable"
      class="xy-tag__close"
      type="button"
      aria-label="close"
      @click.stop="emit('close', $event)"
    >
      <XyIcon icon="mdi:close" :size="closeIconSize" />
    </button>
  </span>
</template>
