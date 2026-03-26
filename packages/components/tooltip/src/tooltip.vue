<script setup lang="ts">
defineOptions({
  name: "XyTooltip"
});

import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import type { ReferenceElement, Strategy } from "@floating-ui/dom";
import { useDismissibleLayer, useFloatingPanel, useFloatingVisibility, useOverlayStack } from "@xiaoye/composables";
import XyTooltipContent from "./content.vue";
import XyTooltipTrigger from "./trigger.vue";
import {
  DEFAULT_TOOLTIP_TRIGGER_KEYS,
  type TooltipExposed,
  type TooltipPopperOptions,
  type TooltipProps,
  type TooltipTrigger
} from "./tooltip";
import { includesTooltipTrigger, normalizeTooltipTriggers } from "./utils";

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
  closeOnOutside: true,
  ariaLabel: undefined,
  effect: "dark",
  rawContent: false,
  transition: "xy-fade",
  virtualRef: null,
  virtualTriggering: false,
  popperOptions: undefined,
  triggerKeys: () => [...DEFAULT_TOOLTIP_TRIGGER_KEYS]
});

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  "before-show": [];
  show: [];
  "before-hide": [];
  hide: [];
  open: [];
  close: [];
}>();

const { zIndex, isTopMost, openLayer, closeLayer } = useOverlayStack();
const triggerRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);
const arrowRef = ref<HTMLElement | null>(null);
const tooltipId = `xy-tooltip-${Math.random().toString(36).slice(2, 10)}`;
const normalizedTriggers = computed<TooltipTrigger[]>(() => normalizeTooltipTriggers(props.trigger));
const isManualTrigger = computed(() => includesTooltipTrigger(normalizedTriggers.value, "manual"));
const closeOnOutsideEnabled = computed(() => {
  if (!props.closeOnOutside || isManualTrigger.value) {
    return false;
  }

  return !normalizedTriggers.value.some((trigger) => trigger === "hover" || trigger === "focus");
});
const normalizedPopperOptions = computed<Required<TooltipPopperOptions>>(() => ({
  strategy: props.popperOptions?.strategy ?? "fixed",
  zIndex: props.popperOptions?.zIndex ?? zIndex.value,
  arrowPadding: props.popperOptions?.arrowPadding ?? 8,
  shiftPadding: props.popperOptions?.shiftPadding ?? 8,
  flip: props.popperOptions?.flip ?? true,
  fallbackPlacements: props.popperOptions?.fallbackPlacements ?? []
}));
const referenceRef = computed<ReferenceElement | null>(() =>
  props.virtualTriggering && props.virtualRef ? props.virtualRef : triggerRef.value
);
const { visible, rendered, open, close, toggle, clearTimers, handleAfterLeave } =
  useFloatingVisibility({
    modelValue: () => props.modelValue,
    disabled: () => props.disabled,
    persistent: () => props.persistent,
    openDelay: () => props.showAfter ?? props.openDelay,
    closeDelay: () => props.hideAfter ?? props.closeDelay,
    beforeOpen: () => {
      emit("before-show");
    },
    beforeClose: () => {
      emit("before-hide");
    },
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
  useFloatingPanel(referenceRef, contentRef, {
    placement: () => props.placement,
    strategy: () => normalizedPopperOptions.value.strategy as Strategy,
    offset: () => props.offset,
    arrowRef: props.showArrow ? arrowRef : undefined,
    arrowPadding: normalizedPopperOptions.value.arrowPadding,
    shiftPadding: () => normalizedPopperOptions.value.shiftPadding,
    flip: () => normalizedPopperOptions.value.flip,
    fallbackPlacements: () => normalizedPopperOptions.value.fallbackPlacements,
    zIndex: () => normalizedPopperOptions.value.zIndex
  });

function isFocusInsideContent(event?: FocusEvent) {
  const target =
    (event?.relatedTarget as Node | null) ??
    (typeof document !== "undefined" ? document.activeElement : null);

  if (!contentRef.value || !target) {
    return false;
  }

  return contentRef.value.contains(target);
}

function isFocusInsideTrigger(event?: FocusEvent) {
  const target =
    (event?.relatedTarget as Node | null) ??
    (typeof document !== "undefined" ? document.activeElement : null);

  if (!triggerRef.value || !target) {
    return false;
  }

  return triggerRef.value.contains(target);
}

function show() {
  open({
    immediate: true
  });
}

function hide() {
  close({
    immediate: true
  });
}

function handleRequestedOpen() {
  if (props.disabled || isManualTrigger.value) {
    return;
  }

  open();
}

function handleRequestedClose(event?: Event) {
  if (props.disabled || isManualTrigger.value) {
    return;
  }

  if (event instanceof FocusEvent && (isFocusInsideContent(event) || isFocusInsideTrigger(event))) {
    return;
  }

  close();
}

function handleRequestedToggle() {
  if (props.disabled || isManualTrigger.value) {
    return;
  }

  toggle();
}

function handleEscape(event: KeyboardEvent) {
  if (!props.closeOnEsc || isManualTrigger.value || !visible.value || !isTopMost.value) {
    return;
  }

  event.preventDefault();
  hide();
}

function handleContentOpen() {
  if (!props.enterable || !includesTooltipTrigger(normalizedTriggers.value, "hover")) {
    return;
  }

  handleRequestedOpen();
}

function handleContentClose(event: MouseEvent) {
  if (!props.enterable || !includesTooltipTrigger(normalizedTriggers.value, "hover")) {
    return;
  }

  handleRequestedClose(event);
}

function handleContentFocusout(event: FocusEvent) {
  if (
    !includesTooltipTrigger(normalizedTriggers.value, "focus") &&
    !includesTooltipTrigger(normalizedTriggers.value, "hover")
  ) {
    return;
  }

  if (isFocusInsideContent(event) || isFocusInsideTrigger(event)) {
    return;
  }

  handleRequestedClose(event);
}

function updateTriggerRef(element: HTMLElement | null) {
  triggerRef.value = element;
}

function updateContentRef(element: HTMLElement | null) {
  contentRef.value = element;
}

function updateArrowRef(element: HTMLElement | null) {
  arrowRef.value = element;
}

function handleTooltipAfterLeave() {
  handleAfterLeave();
  emit("hide");
}

watch([visible, referenceRef], async ([value]) => {
  stopAutoUpdate();

  if (!value) {
    return;
  }

  await nextTick();
  await updatePosition();
  startAutoUpdate();
});

useDismissibleLayer({
  enabled: () => visible.value && !isManualTrigger.value,
  refs: [triggerRef, contentRef],
  closeOnEscape: props.closeOnEsc,
  closeOnOutside: closeOnOutsideEnabled,
  isTopMost: () => isTopMost.value,
  onDismiss: () => {
    hide();
  }
});

onBeforeUnmount(() => {
  clearTimers();
  stopAutoUpdate();
  closeLayer();
});

defineExpose<TooltipExposed>({
  triggerRef,
  contentRef,
  show,
  hide,
  updatePopper: updatePosition,
  isFocusInsideContent
});
</script>

<template>
  <xy-tooltip-trigger
    :open="visible"
    :content-id="tooltipId"
    :disabled="props.disabled"
    :manual="isManualTrigger"
    :trigger="normalizedTriggers"
    :trigger-keys="props.triggerKeys"
    :virtual-ref="props.virtualRef"
    :virtual-triggering="props.virtualTriggering"
    @request-open="handleRequestedOpen"
    @request-close="handleRequestedClose"
    @request-toggle="handleRequestedToggle"
    @escape="handleEscape"
    @reference-change="updateTriggerRef"
  >
    <slot />
  </xy-tooltip-trigger>
  <xy-tooltip-content
    :id="tooltipId"
    :append-to="props.appendTo"
    :aria-label="props.ariaLabel"
    :arrow-style="arrowStyle"
    :content="props.content"
    :effect="props.effect"
    :floating-style="[floatingStyle, props.showArrow ? undefined : { transformOrigin: 'center' }]"
    :max-width="props.maxWidth"
    :persistent="props.persistent"
    :popper-class="props.popperClass"
    :popper-style="props.popperStyle"
    :raw-content="props.rawContent"
    :rendered="rendered"
    :show-arrow="props.showArrow"
    :teleported="props.teleported"
    :transition="props.transition"
    :visible="visible"
    :actual-placement="actualPlacement"
    @request-open="handleContentOpen"
    @request-close="handleContentClose"
    @keydown="handleEscape"
    @focusout="handleContentFocusout"
    @after-enter="emit('show')"
    @after-leave="handleTooltipAfterLeave"
    @content-ref="updateContentRef"
    @arrow-ref="updateArrowRef"
  >
    <template #content>
      <slot name="content">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <span v-if="props.rawContent" v-html="props.content" />
        <template v-else>{{ props.content }}</template>
      </slot>
    </template>
  </xy-tooltip-content>
</template>
