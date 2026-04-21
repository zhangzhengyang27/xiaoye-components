<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { NotificationOptions } from "./types";
import XyuIcon from "../icon/icon.vue";

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

const iconName: Record<string, string> = {
  success: "mdi:check-circle",
  warning: "mdi:alert",
  error: "mdi:close-circle",
  info: "mdi:information"
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
      <XyuIcon
        v-if="props.type && iconName[props.type]"
        :icon="iconName[props.type]"
        :class="`xyu-notification__icon`"
        :size="20"
      />
      <div :class="`xyu-notification__main`">
        <div v-if="props.title" :class="`xyu-notification__title`">{{ props.title }}</div>
        <div v-if="props.message" :class="`xyu-notification__message`">{{ props.message }}</div>
      </div>
      <button v-if="props.showClose" :class="`xyu-notification__close`" @click="close" aria-label="关闭">
        <XyuIcon icon="mdi:close" :size="14" />
      </button>
    </div>
  </transition>
</template>
