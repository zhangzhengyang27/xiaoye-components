<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, provide, ref, watch } from "vue";
import { useZIndex } from "xiaoye-primitives";
import { TRANSITION_ROOT_CONTEXT } from "../transition/transition-root-context";
import type { TransitionRootContext } from "../transition/transition-root-context";

export interface DialogRootProps {
  open?: boolean;
  initialFocus?: HTMLElement | string;
  teleportTo?: string;
}

const props = withDefaults(defineProps<DialogRootProps>(), {
  open: false,
  initialFocus: undefined,
  teleportTo: "body"
});

const emit = defineEmits<{
  close: [];
  open: [];
}>();

const slots = defineSlots<{
  default?: () => unknown;
}>();

const show = ref(props.open);
const isVisible = ref(props.open);
const initialFocusRef = ref<HTMLElement | null>(null);
const panelRef = ref<HTMLElement | null>(null);
const { zIndex, onNextZIndex } = useZIndex();

const transitions: Array<{
  enter: () => void | Promise<void>;
  leave: () => void | Promise<void>;
}> = [];

function registerTransition(
  enter: () => void | Promise<void>,
  leave: () => void | Promise<void>
) {
  transitions.push({ enter, leave });
  return () => {
    const index = transitions.findIndex((t) => t.enter === enter && t.leave === leave);
    if (index > -1) {
      transitions.splice(index, 1);
    }
  };
}

async function enter() {
  show.value = true;
  if (transitions.length > 0) {
    await Promise.all(transitions.map((t) => t.enter()));
  }
  isVisible.value = true;
  zIndex.value = onNextZIndex();
  emit("open");

  if (typeof props.initialFocus === "string") {
    const el = document.querySelector(props.initialFocus) as HTMLElement;
    initialFocusRef.value = el;
  } else if (props.initialFocus instanceof HTMLElement) {
    initialFocusRef.value = props.initialFocus;
  }

  setTimeout(() => {
    if (panelRef.value) {
      const focusable = panelRef.value.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      (focusable || panelRef.value)?.focus();
    }
  }, 50);
}

async function leave() {
  if (transitions.length > 0) {
    await Promise.all(transitions.map((t) => t.leave()));
  }
  show.value = false;
  isVisible.value = false;
  emit("close");
}

function close() {
  leave();
}

watch(
  () => props.open,
  (value) => {
    if (value) {
      enter();
    } else {
      leave();
    }
  },
  { immediate: true }
);

onMounted(() => {
  if (props.open) {
    enter();
  }
});

onBeforeUnmount(() => {
  if (isVisible.value) {
    leave();
  }
});

const context = {
  show,
  isVisible,
  zIndex,
  panelRef,
  initialFocusRef,
  registerTransition,
  open: enter,
  close,
  leave
};

provide("xy-dialog-context", context);

defineExpose({
  open: enter,
  close,
  leave
});
</script>

<template>
  <Teleport :to="props.teleportTo">
    <slot v-if="isVisible || transitions.length > 0" />
  </Teleport>
</template>
