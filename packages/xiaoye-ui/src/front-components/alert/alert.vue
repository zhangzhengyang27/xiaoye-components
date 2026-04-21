<script setup lang="ts">
import { computed, ref } from "vue";
import type { AlertProps } from "./alert";
import XyuIcon from "../icon/icon.vue";

defineOptions({ name: "XyuAlert" });

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

const iconName: Record<string, string> = {
  primary: "mdi:information",
  success: "mdi:check-circle",
  warning: "mdi:alert",
  danger: "mdi:close-circle",
  info: "mdi:information"
};

const iconColor: Record<string, string> = {
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
      <span v-if="props.showIcon" :class="`${ns}__icon`" :style="{ color: iconColor[props.type] }">
        <XyuIcon :icon="iconName[props.type]" :size="16" />
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
        <XyuIcon v-if="!props.closeText" icon="mdi:close" :size="14" />
        <span v-else>{{ props.closeText }}</span>
      </button>
    </div>
  </transition>
</template>
