<script setup lang="ts">
import type { ComponentSize, ComponentStatus } from "@xiaoye/primitives";
import { useConfig, useNamespace } from "@xiaoye/primitives";
import { computed, useSlots } from "vue";
import XyIcon from "../../icon";

type TagLegacyType = "default" | "primary" | "success" | "info" | "warning" | "danger";
type TagVisualStatus = ComponentStatus | "info";

export interface TagProps {
  status?: ComponentStatus;
  type?: TagLegacyType;
  size?: ComponentSize;
  round?: boolean;
  closable?: boolean;
  icon?: string;
}

export type TagCloseHandler = (event: MouseEvent) => void;

const props = withDefaults(defineProps<TagProps>(), {
  status: undefined,
  type: undefined,
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
const resolvedStatus = computed<TagVisualStatus>(() => {
  if (props.status) {
    return props.status;
  }

  switch (props.type) {
    case "default":
      return "neutral";
    case "info":
      return "info";
    case "primary":
    case "success":
    case "warning":
    case "danger":
      return props.type;
    default:
      return "neutral";
  }
});
const iconSizeMap = Object.freeze({
  sm: 12,
  md: 14,
  lg: 16
}) as Readonly<Record<string, number>>;
const closeIconSizeMap = Object.freeze({
  sm: 10,
  md: 12,
  lg: 12
}) as Readonly<Record<string, number>>;

const hasIcon = computed(() => Boolean(props.icon) || Boolean(slots.icon));
const iconSize = computed(() => iconSizeMap[mergedSize.value] ?? 14);
const closeIconSize = computed(() => closeIconSizeMap[mergedSize.value] ?? 12);
</script>

<template>
  <span
    :class="[
      ns.base.value,
      `${ns.base.value}--${resolvedStatus}`,
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
