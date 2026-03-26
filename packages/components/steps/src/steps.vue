<script setup lang="ts">
defineOptions({
  name: "XySteps"
});

import { computed, nextTick, onMounted, onUpdated, provide, shallowRef, watch } from "vue";
import { useNamespace } from "@xiaoye/composables";
import { stepsContextKey } from "./context";
import type { StepState } from "./context";
import type { StepsProps } from "./steps";

const props = withDefaults(defineProps<StepsProps>(), {
  space: "",
  active: 0,
  direction: "horizontal",
  alignCenter: false,
  simple: false,
  finishStatus: "finish",
  processStatus: "process"
});

const emit = defineEmits<{
  change: [newValue: number, oldValue: number];
}>();

const ns = useNamespace("steps");
const steps = shallowRef<StepState[]>([]);
const rootClasses = computed(() => [
  ns.base.value,
  `${ns.base.value}--${props.simple ? "simple" : props.direction}`
]);
const orientation = computed(() => (props.simple ? "horizontal" : props.direction));
const active = computed(() => props.active);
const direction = computed(() => props.direction);
const alignCenter = computed(() => props.alignCenter);
const simple = computed(() => props.simple);
const space = computed(() => props.space);
const finishStatus = computed(() => props.finishStatus);
const processStatus = computed(() => props.processStatus);

let sortScheduled = false;

function compareSteps(left: StepState, right: StepState) {
  const leftEl = left.el.value;
  const rightEl = right.el.value;

  if (leftEl && rightEl && leftEl !== rightEl && typeof Node !== "undefined") {
    const position = leftEl.compareDocumentPosition(rightEl);

    if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
      return -1;
    }

    if (position & Node.DOCUMENT_POSITION_PRECEDING) {
      return 1;
    }
  }

  return left.uid - right.uid;
}

function applyIndexes(list: StepState[]) {
  list.forEach((step, index) => {
    step.setIndex(index);
  });
}

function sortSteps() {
  const ordered = [...steps.value].sort(compareSteps);

  if (ordered.some((step, index) => steps.value[index]?.uid !== step.uid)) {
    steps.value = ordered;
  }

  applyIndexes(ordered);
}

function queueSortSteps() {
  if (sortScheduled) {
    return;
  }

  sortScheduled = true;

  void nextTick(() => {
    sortScheduled = false;
    sortSteps();
  });
}

function addStep(step: StepState) {
  if (steps.value.some((item) => item.uid === step.uid)) {
    return;
  }

  steps.value = [...steps.value, step];
  sortSteps();
}

function removeStep(uid: number) {
  steps.value = steps.value.filter((item) => item.uid !== uid);
  sortSteps();
}

watch(
  () => props.active,
  (newValue, oldValue) => {
    emit("change", newValue, oldValue);
  }
);

provide(stepsContextKey, {
  active,
  direction,
  alignCenter,
  simple,
  space,
  finishStatus,
  processStatus,
  steps,
  addStep,
  removeStep,
  orderSteps: queueSortSteps
});

onMounted(() => {
  sortSteps();
});

onUpdated(() => {
  queueSortSteps();
});
</script>

<template>
  <div :class="rootClasses" role="list" :aria-orientation="orientation">
    <slot />
  </div>
</template>
