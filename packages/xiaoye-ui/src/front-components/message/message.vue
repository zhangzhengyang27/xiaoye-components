<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { MessageOptions } from "./types";
import XyuIcon from "../icon/icon.vue";

const props = withDefaults(defineProps<MessageOptions>(), {
  type: "",
  duration: 3000,
  showClose: false,
  effect: "light"
});

const emit = defineEmits<{
  close: [];
}>();

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
</script>

<template>
  <transition name="xyu-message">
    <div
      v-if="visible"
      :class="['xyu-message', `xyu-message--${props.type}`, props.type ? 'has-icon' : '']"
    >
      <XyuIcon
        v-if="props.type && iconName[props.type]"
        :icon="iconName[props.type]"
        :class="`xyu-message__icon`"
        :size="18"
      />
      <span :class="`xyu-message__content`">{{ props.message }}</span>
      <button v-if="props.showClose" :class="`xyu-message__close`" @click="close" aria-label="关闭">
        <XyuIcon icon="mdi:close" :size="14" />
      </button>
    </div>
  </transition>
</template>
