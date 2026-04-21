<script setup lang="ts">
import { computed, ref, watch, onMounted, onBeforeUnmount } from "vue";
import type { DialogProps } from "./dialog";

const props = withDefaults(defineProps<DialogProps>(), {
  modelValue: false,
  title: "",
  size: "md",
  effect: "light",
  top: "15vh",
  showClose: true,
  closeOnClickModal: true,
  closeOnPressEscape: true,
  destroyOnClose: false,
  zIndex: 2000
});

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  open: [];
  close: [];
  opened: [];
}>();

const slots = defineSlots<{
  default?: () => unknown;
  header?: () => unknown;
  footer?: () => unknown;
}>();

const ns = "xyu-dialog";
const visible = ref(props.modelValue);

watch(() => props.modelValue, (val) => {
  visible.value = val;
  if (val) {
    emit("open");
  }
});

watch(visible, (val) => {
  emit("update:modelValue", val);
  if (!val) emit("close");
});

const widthMap: Record<string, string> = {
  sm: "380px", md: "500px", lg: "720px", xl: "960px", full: "100%"
};

const dialogStyle = computed(() => ({
  width: widthMap[props.size!] ?? props.width,
  marginTop: props.size === "full" ? "0" : props.top,
  zIndex: props.zIndex
}));

function close() {
  visible.value = false;
}

function handleOverlayClick() {
  if (props.closeOnClickModal) close();
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === "Escape" && props.closeOnPressEscape) {
    close();
  }
}

onMounted(() => {
  document.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  document.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
  <teleport to="body">
    <transition name="xyu-dialog">
      <div
        v-if="visible"
        :class="['xyu-dialog__overlay', props.effect === 'dark' ? 'is-dark' : '']"
        @click.self="handleOverlayClick"
      >
        <div :class="['xyu-dialog', `xyu-dialog--${props.size}`]" :style="dialogStyle" role="dialog" aria-modal="true">
          <div :class="`xyu-dialog__header`">
            <slot name="header">
              <span :class="`xyu-dialog__title`">{{ props.title }}</span>
            </slot>
            <button
              v-if="props.showClose"
              :class="`xyu-dialog__close`"
              @click="close"
              aria-label="关闭"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div :class="`xyu-dialog__body`">
            <slot />
          </div>

          <div v-if="slots.footer" :class="`xyu-dialog__footer`">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>
