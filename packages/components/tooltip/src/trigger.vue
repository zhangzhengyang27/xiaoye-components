<script setup lang="ts">
defineOptions({
  name: "XyTooltipTrigger",
  inheritAttrs: false
});

import { computed, onBeforeUnmount, ref, watch } from "vue";
import type { ReferenceElement } from "@floating-ui/dom";
import { useNamespace } from "@xiaoye/composables";
import type { TooltipTrigger } from "./tooltip";
import {
  includesTooltipTrigger,
  isTooltipTriggerKeyMatched,
  resolveReferenceElement
} from "./utils";

interface TooltipTriggerProps {
  open?: boolean;
  contentId?: string;
  disabled?: boolean;
  manual?: boolean;
  trigger?: TooltipTrigger[];
  triggerKeys?: string[];
  virtualRef?: ReferenceElement | null;
  virtualTriggering?: boolean;
}

const props = withDefaults(defineProps<TooltipTriggerProps>(), {
  open: false,
  contentId: "",
  disabled: false,
  manual: false,
  trigger: () => [],
  triggerKeys: () => [],
  virtualRef: null,
  virtualTriggering: false
});

const emit = defineEmits<{
  requestOpen: [event?: Event];
  requestClose: [event?: Event];
  requestToggle: [event?: Event];
  escape: [event: KeyboardEvent];
  referenceChange: [element: HTMLElement | null];
}>();

const ns = useNamespace("tooltip");
const triggerWrapperRef = ref<HTMLElement | null>(null);

const virtualElement = computed(() => resolveReferenceElement(props.virtualRef));
const referenceElement = computed(() =>
  props.virtualTriggering ? virtualElement.value : triggerWrapperRef.value
);
const ariaTargetElement = computed(() => {
  if (props.virtualTriggering) {
    return virtualElement.value;
  }

  const firstChild = triggerWrapperRef.value?.firstElementChild;
  return firstChild instanceof HTMLElement ? firstChild : triggerWrapperRef.value;
});
const hasHoverTrigger = computed(() => includesTooltipTrigger(props.trigger, "hover"));
const hasFocusTrigger = computed(() => includesTooltipTrigger(props.trigger, "focus"));
const hasClickTrigger = computed(() => includesTooltipTrigger(props.trigger, "click"));
const hasContextmenuTrigger = computed(() => includesTooltipTrigger(props.trigger, "contextmenu"));

function canHandleEvents() {
  return !props.disabled && !props.manual;
}

function syncAria(target: HTMLElement | null, previousTarget: HTMLElement | null = null) {
  if (previousTarget && previousTarget !== target) {
    previousTarget.removeAttribute("aria-describedby");
  }

  if (!target) {
    return;
  }

  if (props.open && props.contentId) {
    target.setAttribute("aria-describedby", props.contentId);
    return;
  }

  target.removeAttribute("aria-describedby");
}

function emitReferenceChange() {
  emit("referenceChange", referenceElement.value);
}

function handleMouseenter(event: MouseEvent) {
  if (!canHandleEvents() || !hasHoverTrigger.value) {
    return;
  }

  emit("requestOpen", event);
}

function handleMouseleave(event: MouseEvent) {
  if (!canHandleEvents() || !hasHoverTrigger.value) {
    return;
  }

  emit("requestClose", event);
}

function handleFocusin(event: FocusEvent) {
  if (!canHandleEvents() || (!hasFocusTrigger.value && !hasHoverTrigger.value)) {
    return;
  }

  emit("requestOpen", event);
}

function handleFocusout(event: FocusEvent) {
  if (!canHandleEvents() || (!hasFocusTrigger.value && !hasHoverTrigger.value)) {
    return;
  }

  emit("requestClose", event);
}

function handleClick(event: MouseEvent) {
  if (!canHandleEvents() || !hasClickTrigger.value || event.button !== 0) {
    return;
  }

  emit("requestToggle", event);
}

function handleContextmenu(event: MouseEvent) {
  if (!canHandleEvents() || !hasContextmenuTrigger.value) {
    return;
  }

  event.preventDefault();
  emit("requestToggle", event);
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    emit("escape", event);
    return;
  }

  if (!canHandleEvents()) {
    return;
  }

  if (!isTooltipTriggerKeyMatched(event, props.triggerKeys)) {
    return;
  }

  event.preventDefault();
  emit("requestToggle", event);
}

function addVirtualListeners(element: HTMLElement | null) {
  if (!props.virtualTriggering || !element) {
    return;
  }

  element.addEventListener("mouseenter", handleMouseenter);
  element.addEventListener("mouseleave", handleMouseleave);
  element.addEventListener("focusin", handleFocusin);
  element.addEventListener("focusout", handleFocusout);
  element.addEventListener("click", handleClick);
  element.addEventListener("contextmenu", handleContextmenu);
  element.addEventListener("keydown", handleKeydown);
}

function removeVirtualListeners(element: HTMLElement | null) {
  if (!element) {
    return;
  }

  element.removeEventListener("mouseenter", handleMouseenter);
  element.removeEventListener("mouseleave", handleMouseleave);
  element.removeEventListener("focusin", handleFocusin);
  element.removeEventListener("focusout", handleFocusout);
  element.removeEventListener("click", handleClick);
  element.removeEventListener("contextmenu", handleContextmenu);
  element.removeEventListener("keydown", handleKeydown);
}

watch(
  referenceElement,
  (value, previousValue) => {
    emitReferenceChange();

    if (!props.virtualTriggering) {
      return;
    }

    removeVirtualListeners(previousValue ?? null);
    addVirtualListeners(value ?? null);
  },
  {
    immediate: true
  }
);

watch(
  ariaTargetElement,
  (value, previousValue) => {
    syncAria(value ?? null, previousValue ?? null);
  },
  {
    immediate: true
  }
);

watch(
  () => [props.open, props.contentId] as const,
  () => {
    syncAria(ariaTargetElement.value);
  }
);

onBeforeUnmount(() => {
  removeVirtualListeners(referenceElement.value);
  syncAria(null, ariaTargetElement.value ?? null);
});
</script>

<template>
  <span
    v-if="!props.virtualTriggering || $slots.default"
    ref="triggerWrapperRef"
    :class="ns.base.value"
    @mouseenter="!props.virtualTriggering ? handleMouseenter($event) : undefined"
    @mouseleave="!props.virtualTriggering ? handleMouseleave($event) : undefined"
    @focusin="!props.virtualTriggering ? handleFocusin($event) : undefined"
    @focusout="!props.virtualTriggering ? handleFocusout($event) : undefined"
    @click="!props.virtualTriggering ? handleClick($event) : undefined"
    @contextmenu="!props.virtualTriggering ? handleContextmenu($event) : undefined"
    @keydown="!props.virtualTriggering ? handleKeydown($event) : undefined"
  >
    <slot />
  </span>
</template>
