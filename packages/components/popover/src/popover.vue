<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import type { StyleValue } from "vue";
import type { Placement } from "@floating-ui/dom";
import { focusFirstDescendant } from "@xiaoye/utils";
import {
  useDismissibleLayer,
  useFloatingPanel,
  useFloatingVisibility,
  useOverlayStack,
  useNamespace
} from "@xiaoye/composables";

export interface PopoverProps {
  modelValue?: boolean;
  title?: string;
  content?: string;
  placement?: Placement;
  width?: string | number;
  closeOnOutside?: boolean;
  closeOnEsc?: boolean;
  disabled?: boolean;
  trigger?: "click" | "hover" | "focus" | "manual";
  openDelay?: number;
  closeDelay?: number;
  showAfter?: number;
  hideAfter?: number;
  enterable?: boolean;
  offset?: number;
  showArrow?: boolean;
  teleported?: boolean;
  appendTo?: string | HTMLElement;
  persistent?: boolean;
  popperClass?: string;
  popperStyle?: StyleValue;
}

const props = withDefaults(defineProps<PopoverProps>(), {
  modelValue: false,
  title: "",
  content: "",
  placement: "bottom",
  width: 320,
  closeOnOutside: true,
  closeOnEsc: true,
  disabled: false,
  trigger: "click",
  openDelay: 80,
  closeDelay: 60,
  showAfter: undefined,
  hideAfter: undefined,
  enterable: true,
  offset: 10,
  showArrow: true,
  teleported: true,
  appendTo: "body",
  persistent: false,
  popperClass: "",
  popperStyle: undefined
});

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  open: [];
  close: [];
}>();

const ns = useNamespace("popover");
const triggerRef = ref<HTMLElement | null>(null);
const panelRef = ref<HTMLElement | null>(null);
const arrowRef = ref<HTMLElement | null>(null);
let lastFocusedElement: HTMLElement | null = null;
const isClient = typeof document !== "undefined";
const teleportTarget = computed(() => props.appendTo ?? "body");
const { visible, rendered, open: openFloating, close: closeFloating, toggle, clearTimers, handleAfterLeave } =
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
      lastFocusedElement =
        isClient && document.activeElement instanceof HTMLElement ? document.activeElement : null;
      emit("open");
      openLayer();
    },
    onClose: () => {
      emit("close");
      stopAutoUpdate();
      closeLayer();
      lastFocusedElement?.focus();
      lastFocusedElement = null;
    }
  });

const { zIndex, isTopMost, openLayer, closeLayer } = useOverlayStack();
const { actualPlacement, arrowStyle, floatingStyle, updatePosition, startAutoUpdate, stopAutoUpdate } = useFloatingPanel(
  triggerRef,
  panelRef,
  {
    placement: () => props.placement,
    strategy: "fixed",
    offset: () => props.offset,
    arrowRef,
    zIndex
  }
);

function handleTriggerClick() {
  if (props.trigger !== "click") {
    return;
  }

  toggle();
}

function handleTriggerKeydown(event: KeyboardEvent) {
  if (props.trigger === "manual") {
    return;
  }

  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    toggle();
    return;
  }

  if (event.key === "Escape") {
    event.preventDefault();
    closeFloating({
      immediate: true
    });
  }
}

useDismissibleLayer({
  enabled: () => visible.value,
  refs: [triggerRef, panelRef],
  closeOnEscape: props.closeOnEsc,
  closeOnOutside: props.closeOnOutside && props.trigger === "click",
  isTopMost: () => isTopMost.value,
  onDismiss: () => {
    closeFloating({
      immediate: true
    });
  }
});

watch(visible, async (value) => {
  stopAutoUpdate();

  if (!value) {
    return;
  }

  await nextTick();
  await updatePosition();
  startAutoUpdate();
  if (!focusFirstDescendant(panelRef.value)) {
    panelRef.value?.focus();
  }
});

function scheduleOpen() {
  if (props.trigger === "manual") {
    return;
  }

  openFloating();
}

function scheduleClose() {
  if (props.trigger === "manual") {
    return;
  }

  closeFloating();
}

onBeforeUnmount(() => {
  clearTimers();
  stopAutoUpdate();
});
</script>

<template>
  <span :class="ns.base.value">
    <span
      ref="triggerRef"
      class="xy-popover__trigger"
      role="button"
      tabindex="0"
      :aria-expanded="visible"
      @click="handleTriggerClick"
      @mouseenter="props.trigger === 'hover' ? scheduleOpen() : undefined"
      @mouseleave="props.trigger === 'hover' ? scheduleClose() : undefined"
      @focusin="props.trigger === 'focus' ? scheduleOpen() : undefined"
      @focusout="props.trigger === 'focus' ? scheduleClose() : undefined"
      @keydown="handleTriggerKeydown"
    >
      <slot name="reference">
        <slot name="trigger">
          <button type="button" class="xy-popover__default-trigger">打开说明</button>
        </slot>
      </slot>
    </span>
    <teleport :to="teleportTarget" :disabled="!props.teleported">
      <transition name="xy-fade" @after-leave="handleAfterLeave">
        <section
          v-if="rendered"
          v-show="visible"
          ref="panelRef"
          :class="[
            ns.base.value + '__panel',
            `${ns.base.value}__panel--${actualPlacement.split('-')[0]}`,
            props.popperClass
          ]"
          :style="[
            floatingStyle,
            { width: typeof props.width === 'number' ? `${props.width}px` : props.width },
            props.popperStyle
          ]"
          role="dialog"
          aria-modal="false"
          tabindex="-1"
          @mouseenter="props.enterable && props.trigger === 'hover' ? scheduleOpen() : undefined"
          @mouseleave="props.enterable && props.trigger === 'hover' ? scheduleClose() : undefined"
        >
          <span
            v-if="props.showArrow"
            ref="arrowRef"
            class="xy-popover__arrow"
            :style="arrowStyle"
          />
          <header v-if="props.title || $slots.header" class="xy-popover__header">
            <slot name="header">
              <strong>{{ props.title }}</strong>
            </slot>
          </header>
          <div class="xy-popover__body">
            <slot
              :close="
                () =>
                  closeFloating({
                    immediate: true
                  })
              "
            >
              {{ props.content }}
            </slot>
          </div>
        </section>
      </transition>
    </teleport>
  </span>
</template>
