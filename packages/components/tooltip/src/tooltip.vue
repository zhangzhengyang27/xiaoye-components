<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import type { StyleValue } from "vue";
import {
  useDismissibleLayer,
  useFloatingPanel,
  useFloatingVisibility,
  useNamespace,
  useOverlayStack
} from "@xiaoye/composables";

type TooltipPlacement =
  | "top"
  | "top-start"
  | "top-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "left"
  | "right";

export interface TooltipProps {
  modelValue?: boolean;
  content?: string;
  placement?: TooltipPlacement;
  disabled?: boolean;
  openDelay?: number;
  closeDelay?: number;
  showAfter?: number;
  hideAfter?: number;
  enterable?: boolean;
  trigger?: "hover" | "click" | "focus" | "manual";
  offset?: number;
  showArrow?: boolean;
  maxWidth?: number | string;
  teleported?: boolean;
  appendTo?: string | HTMLElement;
  persistent?: boolean;
  popperClass?: string;
  popperStyle?: StyleValue;
  closeOnEsc?: boolean;
  closeOnOutside?: boolean;
}

const props = withDefaults(defineProps<TooltipProps>(), {
  modelValue: false,
  content: "",
  placement: "top",
  disabled: false,
  openDelay: 80,
  closeDelay: 60,
  showAfter: undefined,
  hideAfter: undefined,
  enterable: true,
  trigger: "hover",
  offset: 10,
  showArrow: true,
  maxWidth: 240,
  teleported: true,
  appendTo: "body",
  persistent: false,
  popperClass: "",
  popperStyle: undefined,
  closeOnEsc: true,
  closeOnOutside: true
});

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  open: [];
  close: [];
}>();

const ns = useNamespace("tooltip");
const { zIndex, isTopMost, openLayer, closeLayer } = useOverlayStack();
const triggerRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);
const arrowRef = ref<HTMLElement | null>(null);
const tooltipId = `xy-tooltip-${Math.random().toString(36).slice(2, 10)}`;
const teleportTarget = computed(() => props.appendTo ?? "body");
const { visible, rendered, open, close, toggle, clearTimers, handleAfterLeave } =
  useFloatingVisibility({
    modelValue: () => props.modelValue,
    disabled: () => props.disabled,
    persistent: () => props.persistent,
    openDelay: () => props.showAfter ?? props.openDelay,
    closeDelay: () => props.hideAfter ?? props.closeDelay,
    emitModelValue: (value) => {
      emit("update:modelValue", value);
    },
    onOpen: () => {
      emit("open");
      openLayer();
    },
    onClose: () => {
      emit("close");
      closeLayer();
      stopAutoUpdate();
    }
  });

const { actualPlacement, arrowStyle, floatingStyle, updatePosition, startAutoUpdate, stopAutoUpdate } =
  useFloatingPanel(triggerRef, contentRef, {
    placement: () => props.placement,
    strategy: "fixed",
    offset: () => props.offset,
    arrowRef,
    zIndex
  });

function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    event.preventDefault();
    close({
      immediate: true
    });
  }
}

function handleOpen() {
  if (props.trigger === "manual") {
    return;
  }

  open();
}

function handleClose() {
  if (props.trigger === "manual") {
    return;
  }

  close();
}

function handleToggleByClick() {
  if (props.disabled || props.trigger !== "click") {
    return;
  }

  toggle();
}

watch(visible, async (value) => {
  stopAutoUpdate();

  if (!value) {
    return;
  }

  await nextTick();
  await updatePosition();
  startAutoUpdate();
});

useDismissibleLayer({
  enabled: () => visible.value && props.trigger === "click",
  refs: [triggerRef, contentRef],
  closeOnEscape: props.closeOnEsc,
  closeOnOutside: props.closeOnOutside,
  isTopMost: () => isTopMost.value,
  onDismiss: () => {
    close({
      immediate: true
    });
  }
});

onBeforeUnmount(() => {
  clearTimers();
  stopAutoUpdate();
  closeLayer();
});
</script>

<template>
  <span
    ref="triggerRef"
    :class="ns.base.value"
    :aria-describedby="visible ? tooltipId : undefined"
    @mouseenter="props.trigger === 'hover' ? handleOpen() : undefined"
    @mouseleave="props.trigger === 'hover' ? handleClose() : undefined"
    @focusin="props.trigger === 'focus' || props.trigger === 'hover' ? handleOpen() : undefined"
    @focusout="props.trigger === 'focus' || props.trigger === 'hover' ? handleClose() : undefined"
    @click="handleToggleByClick"
    @keydown="handleKeydown"
  >
    <slot />
    <teleport :to="teleportTarget" :disabled="!props.teleported">
      <transition name="xy-fade" @after-leave="handleAfterLeave">
        <div
          v-if="rendered"
          v-show="visible"
          :id="tooltipId"
          ref="contentRef"
          role="tooltip"
          :class="[
            `${ns.base.value}__content`,
            `${ns.base.value}__content--${actualPlacement.split('-')[0]}`,
            props.popperClass
          ]"
          :style="[
            floatingStyle,
            {
              maxWidth: typeof props.maxWidth === 'number' ? `${props.maxWidth}px` : props.maxWidth
            },
            props.popperStyle
          ]"
          @mouseenter="props.enterable && props.trigger === 'hover' ? handleOpen() : undefined"
          @mouseleave="props.enterable && props.trigger === 'hover' ? handleClose() : undefined"
          @keydown="handleKeydown"
        >
          <span
            v-if="props.showArrow"
            ref="arrowRef"
            :class="`${ns.base.value}__arrow`"
            :style="arrowStyle"
          />
          <slot name="content">
            {{ props.content }}
          </slot>
        </div>
      </transition>
    </teleport>
  </span>
</template>
