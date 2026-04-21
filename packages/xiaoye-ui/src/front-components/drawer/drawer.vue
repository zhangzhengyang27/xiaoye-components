<script setup lang="ts">
import { computed, watch, ref, onBeforeUnmount } from "vue";
import type { DrawerProps } from "./drawer";

const props = withDefaults(defineProps<DrawerProps>(), {
  modelValue: false,
  title: "",
  size: "md",
  placement: "right",
  showClose: true,
  closeOnClickModal: true,
  destroyOnClose: false,
  zIndex: 2000,
  withHeader: true
});

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  close: [];
}>();

const slots = defineSlots<{
  default?: () => unknown;
  header?: () => unknown;
  footer?: () => unknown;
}>();

const ns = "xyu-drawer";
const visible = ref(props.modelValue);

watch(() => props.modelValue, (val) => { visible.value = val; });
watch(visible, (val) => {
  emit("update:modelValue", val);
  if (!val) emit("close");
});

const sizeMap: Record<string, string> = { sm: "320px", md: "480px", lg: "640px", xl: "800px" };

const drawerStyle = computed(() => {
  const placement = props.placement ?? "right";
  const isVertical = placement === "left" || placement === "right";
  const sz = typeof props.size === "string" ? (sizeMap[props.size] ?? props.size) : `${props.size}px`;
  return isVertical
    ? { [placement === "right" ? "right" : "left"]: "0", width: sz }
    : { [placement === "bottom" ? "bottom" : "top"]: "0", height: sz };
});

function close() { visible.value = false; }
function handleOverlayClick() { if (props.closeOnClickModal) close(); }
function handleKeydown(e: KeyboardEvent) { if (e.key === "Escape") close(); }
onBeforeUnmount(() => document.removeEventListener("keydown", handleKeydown));
import { onMounted } from "vue";
onMounted(() => document.addEventListener("keydown", handleKeydown));
</script>

<template>
  <teleport to="body">
    <transition name="xyu-drawer">
      <div
        v-if="visible"
        :class="`xyu-drawer__overlay`"
        :style="{ zIndex: props.zIndex }"
        @click.self="handleOverlayClick"
      >
        <div
          :class="['xyu-drawer', `xyu-drawer--${props.placement}`]"
          :style="drawerStyle"
          role="dialog"
        >
          <div v-if="props.withHeader" :class="`xyu-drawer__header`">
            <slot name="header">
              <span :class="`xyu-drawer__title`">{{ props.title }}</span>
            </slot>
            <button v-if="props.showClose" :class="`xyu-drawer__close`" @click="close" aria-label="关闭">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <div :class="`xyu-drawer__body`"><slot /></div>
          <div v-if="slots.footer" :class="`xyu-drawer__footer`"><slot name="footer" /></div>
        </div>
      </div>
    </transition>
  </teleport>
</template>
