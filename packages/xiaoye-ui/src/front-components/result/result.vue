<script setup lang="ts">
import { computed } from "vue";
import type { ResultProps } from "./result";

const props = withDefaults(defineProps<ResultProps>(), {
  type: "info",
  title: ""
});

const ns = "xyu-result";

const iconMap: Record<string, string> = {
  success: "✅",
  warning: "⚠️",
  error: "❌",
  info: "ℹ️",
  "404": "🔍",
  "403": "🔒",
  "500": "💥",
  empty: "📭"
};

const colorMap: Record<string, string> = {
  success: "var(--xyu-success)",
  warning: "var(--xyu-warning)",
  error: "var(--xyu-error)",
  info: "var(--xyu-primary)",
  "404": "var(--xyu-text-secondary)",
  "403": "var(--xyu-warning)",
  "500": "var(--xyu-error)",
  empty: "var(--xyu-text-secondary)"
};

const icon = computed(() => props.icon || iconMap[props.type] || "ℹ️");
const iconColor = computed(() => colorMap[props.type] || "var(--xyu-primary)");

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
    <div :class="`${ns}__icon`" :style="{ color: iconColor }">
      <slot name="icon">{{ icon }}</slot>
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
