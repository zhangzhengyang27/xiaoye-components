<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { NotificationOptions } from "./types";

const props = withDefaults(defineProps<NotificationOptions>(), {
  title: "",
  message: "",
  type: "",
  duration: 4500,
  showClose: true,
  position: "top-right",
  offset: 20,
  zIndex: 9999
});

const emit = defineEmits<{ close: [] }>();
const visible = ref(true);

function close() {
  visible.value = false;
  setTimeout(() => emit("close"), 300);
}

onMounted(() => {
  if (props.duration > 0) {
    setTimeout(close, props.duration);
  }
});

const iconMap: Record<string, string> = {
  success: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  warning: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
  error: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
  info: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
};

const posStyle = (() => {
  const pos = props.position ?? "top-right";
  const offset = props.offset ?? 20;
  if (pos === "top-right") return { top: `${offset}px`, right: `${offset}px` };
  if (pos === "top-left") return { top: `${offset}px`, left: `${offset}px` };
  if (pos === "bottom-right") return { bottom: `${offset}px`, right: `${offset}px` };
  if (pos === "bottom-left") return { bottom: `${offset}px`, left: `${offset}px` };
  return {};
})();
</script>

<template>
  <transition name="xyu-notification">
    <div
      v-if="visible"
      :class="['xyu-notification', `xyu-notification--${props.type}`, props.type ? 'has-icon' : '']"
      :style="{ ...posStyle, zIndex: props.zIndex }"
    >
      <svg
        v-if="props.type && iconMap[props.type]"
        :class="`xyu-notification__icon`"
        width="20" height="20"
        viewBox="0 0 24 24"
        fill="none" stroke="currentColor"
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
      >
        <path :d="iconMap[props.type]" />
      </svg>
      <div :class="`xyu-notification__main`">
        <div v-if="props.title" :class="`xyu-notification__title`">{{ props.title }}</div>
        <div v-if="props.message" :class="`xyu-notification__message`">{{ props.message }}</div>
      </div>
      <button v-if="props.showClose" :class="`xyu-notification__close`" @click="close" aria-label="关闭">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  </transition>
</template>
