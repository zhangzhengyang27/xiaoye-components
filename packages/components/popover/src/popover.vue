<script setup lang="ts">
import { nextTick, ref, watch } from "vue";
import type { Placement } from "@floating-ui/dom";
import { focusFirstDescendant } from "@xiaoye/utils";
import { useDismissibleLayer, useFloatingPanel, useOverlayStack, useNamespace } from "@xiaoye/composables";

export interface PopoverProps {
  modelValue?: boolean;
  title?: string;
  placement?: Placement;
  width?: string | number;
  closeOnOutside?: boolean;
  closeOnEsc?: boolean;
}

const props = withDefaults(defineProps<PopoverProps>(), {
  modelValue: false,
  title: "",
  placement: "bottom",
  width: 320,
  closeOnOutside: true,
  closeOnEsc: true
});

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  open: [];
  close: [];
}>();

const ns = useNamespace("popover");
const triggerRef = ref<HTMLElement | null>(null);
const panelRef = ref<HTMLElement | null>(null);
const open = ref(props.modelValue);
let lastFocusedElement: HTMLElement | null = null;
const isClient = typeof document !== "undefined";

const { zIndex, isTopMost, openLayer, closeLayer } = useOverlayStack();
const { floatingStyle, updatePosition, startAutoUpdate, stopAutoUpdate } = useFloatingPanel(
  triggerRef,
  panelRef,
  {
    placement: props.placement,
    zIndex
  }
);

function closePopover() {
  if (!open.value) {
    return;
  }

  open.value = false;
  emit("update:modelValue", false);
  emit("close");
  stopAutoUpdate();
  closeLayer();
  lastFocusedElement?.focus();
}

async function openPopover() {
  if (open.value) {
    return;
  }

  lastFocusedElement =
    isClient && document.activeElement instanceof HTMLElement ? document.activeElement : null;
  open.value = true;
  emit("update:modelValue", true);
  emit("open");
  openLayer();

  await nextTick();
  await updatePosition();
  startAutoUpdate();
  if (!focusFirstDescendant(panelRef.value)) {
    panelRef.value?.focus();
  }
}

function togglePopover() {
  if (open.value) {
    closePopover();
    return;
  }

  void openPopover();
}

watch(
  () => props.modelValue,
  (value) => {
    if (value === open.value) {
      return;
    }

    if (value) {
      void openPopover();
      return;
    }

    closePopover();
  }
);

useDismissibleLayer({
  enabled: open,
  refs: [triggerRef, panelRef],
  closeOnEscape: props.closeOnEsc,
  closeOnOutside: props.closeOnOutside,
  isTopMost: () => isTopMost.value,
  onDismiss: () => {
    closePopover();
  }
});
</script>

<template>
  <span :class="ns.base.value">
    <span
      ref="triggerRef"
      class="xy-popover__trigger"
      role="button"
      tabindex="0"
      :aria-expanded="open"
      @click="togglePopover"
      @keydown.enter.prevent="togglePopover"
      @keydown.space.prevent="togglePopover"
    >
      <slot name="trigger">
        <button type="button" class="xy-popover__default-trigger">打开说明</button>
      </slot>
    </span>
    <teleport to="body">
      <transition name="xy-fade">
        <section
          v-if="open"
          ref="panelRef"
          :class="ns.base.value + '__panel'"
          :style="[
            floatingStyle,
            { width: typeof props.width === 'number' ? `${props.width}px` : props.width }
          ]"
          role="dialog"
          aria-modal="false"
          tabindex="-1"
        >
          <header v-if="props.title || $slots.header" class="xy-popover__header">
            <slot name="header">
              <strong>{{ props.title }}</strong>
            </slot>
          </header>
          <div class="xy-popover__body">
            <slot />
          </div>
        </section>
      </transition>
    </teleport>
  </span>
</template>
