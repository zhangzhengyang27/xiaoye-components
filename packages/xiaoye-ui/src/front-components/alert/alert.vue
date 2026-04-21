<script setup lang="ts">
import { computed, ref } from "vue";
import type { AlertProps } from "./alert";

const props = withDefaults(defineProps<AlertProps>(), {
  title: "",
  description: "",
  type: "info",
  closable: false,
  closeText: "",
  showIcon: true,
  effect: "light",
  center: false,
  descriptionLineClamp: 0,
  modelValue: true,
  displayMode: "default"
});

const emit = defineEmits<{
  close: [event: MouseEvent];
  "update:modelValue": [value: boolean];
}>();

const ns = "xyu-alert";
const isCollapsed = ref(false);

const isVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val)
});

const alertClasses = computed(() => [
  ns,
  `${ns}--${props.type}`,
  `${ns}--${props.displayMode}`,
  props.center ? "is-center" : "",
  props.effect === "dark" ? "is-dark" : "",
  !isVisible.value ? "is-hidden" : ""
]);

function handleClose(event: MouseEvent) {
  isVisible.value = false;
  emit("close", event);
}

function toggleCollapse() {
  isCollapsed.value = !isCollapsed.value;
}

const iconMap: Record<string, string> = {
  primary: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z",
  success: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z",
  warning: "M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z",
  danger: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z",
  info: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
};

const colorMap: Record<string, string> = {
  primary: "var(--xyu-primary)",
  success: "var(--xyu-success)",
  warning: "var(--xyu-warning)",
  danger: "var(--xyu-error)",
  info: "var(--xyu-info)"
};
</script>

<template>
  <transition name="xyu-alert-fade">
    <div v-if="isVisible" :class="alertClasses" role="alert">
      <!-- Icon -->
      <span v-if="props.showIcon" :class="`${ns}__icon`">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path :d="iconMap[props.type]" fill="currentColor" stroke="none" />
        </svg>
      </span>

      <!-- Content -->
      <div :class="`${ns}__content`">
        <div v-if="props.title" :class="[`${ns}__title`, props.description ? 'with-description' : '']">
          {{ props.title }}
        </div>
        <div
          v-if="props.description"
          :class="[`${ns}__description`, isCollapsed ? 'is-collapsed' : '']"
        >
          {{ props.description }}
        </div>
        <button
          v-if="props.descriptionLineClamp > 0 && props.description"
          :class="`${ns}__toggle`"
          type="button"
          @click="toggleCollapse"
        >
          {{ isCollapsed ? "展开" : "收起" }}
        </button>
      </div>

      <!-- Actions slot -->
      <div v-if="$slots.actions" :class="`${ns}__actions`">
        <slot name="actions" />
      </div>

      <!-- Close button -->
      <button
        v-if="props.closable"
        :class="`${ns}__close`"
        type="button"
        @click="handleClose"
      >
        <svg v-if="!props.closeText" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
        <span v-else>{{ props.closeText }}</span>
      </button>
    </div>
  </transition>
</template>
