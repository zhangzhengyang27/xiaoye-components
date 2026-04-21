<script setup lang="ts">
import { computed } from "vue";
import type { ResultProps } from "./result";
import XyuIcon from "../icon/icon.vue";

const props = withDefaults(defineProps<ResultProps>(), {
  type: "info",
  title: ""
});

const ns = "xyu-result";

const iconName: Record<string, string> = {
  success: "mdi:check-circle",
  warning: "mdi:alert",
  error: "mdi:close-circle",
  info: "mdi:information",
  "404": "mdi:map-marker-question",
  "403": "mdi:lock",
  "500": "mdi:alert-circle",
  empty: "mdi:inbox-outline"
};

const iconColor: Record<string, string> = {
  success: "var(--xyu-success)",
  warning: "var(--xyu-warning)",
  error: "var(--xyu-error)",
  info: "var(--xyu-primary)",
  "404": "var(--xyu-text-secondary)",
  "403": "var(--xyu-warning)",
  "500": "var(--xyu-error)",
  empty: "var(--xyu-text-secondary)"
};

const resolvedIcon = computed(() => {
  if (props.icon) return props.icon;
  return iconName[props.type] || "mdi:information";
});

const resolvedColor = computed(() => iconColor[props.type] || "var(--xyu-primary)");

const slots = defineSlots<{
  icon?: () => unknown;
  title?: () => unknown;
  subTitle?: () => unknown;
  default?: () => unknown;
  extra?: () => unknown;
}>();
</script>

<template>
  <div :class="ns">
    <div :class="`${ns}__icon`" :style="{ color: resolvedColor }">
      <slot name="icon">
        <XyuIcon :icon="resolvedIcon" :size="64" />
      </slot>
    </div>
    <div v-if="slots.title || props.title" :class="`${ns}__title`">
      <slot name="title">{{ props.title }}</slot>
    </div>
    <div v-if="slots.subTitle || props.description" :class="`${ns}__description`">
      <slot name="subTitle">{{ props.description }}</slot>
    </div>
    <div v-if="slots.default" :class="`${ns}__content`">
      <slot />
    </div>
    <div v-if="slots.extra" :class="`${ns}__extra`">
      <slot name="extra" />
    </div>
  </div>
</template>
