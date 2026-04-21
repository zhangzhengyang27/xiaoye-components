<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, provide, ref, watch } from "vue";
import { TRANSITION_ROOT_CONTEXT } from "./transition-root-context";
import type { TransitionRootContext } from "./transition-root-context";

export interface TransitionRootProps {
  show?: boolean;
  appear?: boolean;
}

const props = withDefaults(defineProps<TransitionRootProps>(), {
  show: false,
  appear: false
});

const emit = defineEmits<{
  beforeEnter: [];
  afterEnter: [];
  beforeLeave: [];
  afterLeave: [];
}>();

const slots = defineSlots<{
  default?: () => unknown;
}>();

const show = ref(props.show);
const isVisible = ref(props.show);
const isTransitioning = ref(false);
const transitions: Array<{ enter: () => void | Promise<void>; leave: () => void | Promise<void> }> = [];

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
  emit("beforeEnter");
  isTransitioning.value = true;
  show.value = true;

  if (transitions.length > 0) {
    await Promise.all(transitions.map((t) => t.enter()));
  }

  isTransitioning.value = false;
  emit("afterEnter");
}

async function leave() {
  emit("beforeLeave");
  isTransitioning.value = true;

  if (transitions.length > 0) {
    await Promise.all(transitions.map((t) => t.leave()));
  }

  isTransitioning.value = false;
  show.value = false;
  emit("afterLeave");
}

watch(
  () => props.show,
  async (value) => {
    if (value) {
      await enter();
      isVisible.value = true;
    } else {
      await leave();
      isVisible.value = false;
    }
  }
);

onMounted(() => {
  if (props.appear && props.show) {
    enter().then(() => {
      isVisible.value = true;
    });
  }
});

const context: TransitionRootContext = {
  show,
  isVisible,
  isTransitioning,
  registerTransition,
  open: enter,
  close: leave
};

provide(TRANSITION_ROOT_CONTEXT, context);

defineExpose({
  open: enter,
  close: leave
});
</script>

<template>
  <slot v-if="isVisible || isTransitioning" />
</template>
