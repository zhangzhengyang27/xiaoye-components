<script setup lang="ts">
import { computed, inject, onBeforeUnmount, ref, watch } from "vue";
import { TRANSITION_ROOT_CONTEXT } from "./transition-root-context";
import type { TransitionRootContext } from "./transition-root-context";

export interface TransitionChildProps {
  show?: boolean;
  appear?: boolean;
  enter?: string;
  enterFrom?: string;
  enterTo?: string;
  leave?: string;
  leaveFrom?: string;
  leaveTo?: string;
  enterInitiallyVisible?: boolean;
}

const props = withDefaults(defineProps<TransitionChildProps>(), {
  show: false,
  appear: false,
  enter: "",
  enterFrom: "",
  enterTo: "",
  leave: "",
  leaveFrom: "",
  leaveTo: "",
  enterInitiallyVisible: false
});

const slots = defineSlots<{
  default?: (props: { show: boolean }) => unknown;
}>();

const rootContext = inject<TransitionRootContext | null>(TRANSITION_ROOT_CONTEXT, null);
const isVisible = ref(props.enterInitiallyVisible || props.show);
const isEntering = ref(false);
const isLeaving = ref(false);
const transitionClasses = ref("");

function addClasses(classes: string) {
  transitionClasses.value = classes;
}

function removeClasses() {
  transitionClasses.value = "";
}

async function performEnter() {
  if (!props.enter && !props.enterFrom && !props.enterTo) {
    isVisible.value = true;
    return;
  }

  isEntering.value = true;
  addClasses(props.enterFrom);

  await nextFrame();

  removeClasses();
  addClasses(props.enter);

  await nextFrame();

  addClasses(props.enterTo);

  await nextFrame();

  removeClasses();
  isEntering.value = false;
  isVisible.value = true;
}

async function performLeave() {
  if (!props.leave && !props.leaveFrom && !props.leaveTo) {
    isVisible.value = false;
    return;
  }

  isLeaving.value = true;
  addClasses(props.leaveFrom);

  await nextFrame();

  removeClasses();
  addClasses(props.leave);

  await nextFrame();

  addClasses(props.leaveTo);

  await wait(props.getTransitionDuration?.() ?? 200);

  removeClasses();
  isLeaving.value = false;
  isVisible.value = false;
}

function nextFrame(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let cleanup: (() => void) | null = null;

if (rootContext) {
  cleanup = rootContext.registerTransition(performEnter, performLeave);
} else {
  watch(
    () => props.show,
    (value) => {
      if (value) {
        performEnter();
      } else {
        performLeave();
      }
    },
    { immediate: true }
  );
}

onBeforeUnmount(() => {
  cleanup?.();
});

const slotProps = computed(() => ({
  show: isVisible.value
}));

defineExpose({
  performEnter,
  performLeave
});
</script>

<template>
  <div :class="transitionClasses">
    <slot v-if="isVisible || isEntering" v-bind="slotProps" />
  </div>
</template>
