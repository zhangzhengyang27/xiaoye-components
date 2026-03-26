<script setup lang="ts">
defineOptions({
  name: "XyStep"
});

import { computed, getCurrentInstance, inject, onBeforeUnmount, onMounted, ref, useSlots, watch } from "vue";
import type { CSSProperties } from "vue";
import { useNamespace } from "@xiaoye/composables";
import XyIcon from "../../icon";
import { stepsContextKey } from "./context";
import type { StepState } from "./context";
import type { StepProps, StepStatus } from "./step";
import type { StepsDirection, StepsStatus } from "./steps";

const props = withDefaults(defineProps<StepProps>(), {
  title: "",
  icon: "",
  description: "",
  status: ""
});

const slots = useSlots();
const ns = useNamespace("steps");
const parent = inject(stepsContextKey, null);
const currentInstance = getCurrentInstance();
const itemRef = ref<HTMLElement | null>(null);
const index = ref(parent ? -1 : 0);
const internalStatus = ref<StepsStatus>("wait");
const lineStyle = ref<CSSProperties>({});

const fallbackDirection = computed<StepsDirection>(() => "horizontal");
const currentDirection = computed(() => (parent?.simple.value ? "horizontal" : parent?.direction.value) ?? fallbackDirection.value);
const currentActive = computed(() => parent?.active.value ?? 0);
const isSimple = computed(() => parent?.simple.value ?? false);
const isVertical = computed(() => currentDirection.value === "vertical");
const isCenter = computed(() => !isSimple.value && !isVertical.value && Boolean(parent?.alignCenter.value));
const stepCount = computed(() => parent?.steps.value.length || 1);
const isLast = computed(() => {
  if (!parent || !currentInstance) {
    return true;
  }

  return parent.steps.value.at(-1)?.uid === currentInstance.uid;
});
const customIconName = computed(() => props.icon);
const hasIconSlot = computed(() => Boolean(slots.icon));
const hasDescription = computed(() => Boolean(props.description) || Boolean(slots.description));
const builtInIconName = computed(() => {
  if (customIconName.value) {
    return customIconName.value;
  }

  if (currentStatus.value === "success") {
    return "mdi:check";
  }

  if (currentStatus.value === "error") {
    return "mdi:close";
  }

  return "";
});
const isStatusIcon = computed(
  () => !customIconName.value && (currentStatus.value === "success" || currentStatus.value === "error")
);
const currentStatus = computed<StepStatus>(() => props.status || internalStatus.value);
const statusClass = computed(() => ns.is(currentStatus.value, Boolean(currentStatus.value)));
const itemClasses = computed(() => [
  `${ns.base.value}__item`,
  ns.is(isSimple.value ? "simple" : currentDirection.value, true),
  ns.is("flex", !isSimple.value && !isCenter.value && !parent?.space.value && !isVertical.value && isLast.value),
  ns.is("center", isCenter.value),
  ns.is("last", isLast.value),
  statusClass.value
]);
const headClasses = computed(() => [`${ns.base.value}__head`, statusClass.value]);
const titleClasses = computed(() => [`${ns.base.value}__title`, statusClass.value]);
const descriptionClasses = computed(() => [`${ns.base.value}__description`, statusClass.value]);
const iconClasses = computed(() => [
  `${ns.base.value}__icon`,
  ns.is(hasIconSlot.value || Boolean(customIconName.value) || isStatusIcon.value ? "icon" : "text", true)
]);
const itemStyle = computed<CSSProperties>(() => {
  if (isSimple.value) {
    return {};
  }

  const style: CSSProperties = {};
  const currentSpace = parent?.space.value ?? "";

  if (typeof currentSpace === "number") {
    style.flexBasis = `${currentSpace}px`;
  } else if (currentSpace) {
    style.flexBasis = currentSpace;
  } else {
    const denominator = Math.max(stepCount.value - (isCenter.value ? 0 : 1), 1);
    style.flexBasis = `${100 / denominator}%`;

    if (!isVertical.value && isLast.value) {
      style.maxWidth = `${100 / Math.max(stepCount.value, 1)}%`;
    }
  }

  return style;
});

function setIndex(value: number) {
  index.value = value;
  syncStatus(currentActive.value, currentActive.value);
}

function calcProgress(status: StepsStatus, active: number, previousActive: number) {
  const stepDiff = active - previousActive;
  let transitionDelay = 0;

  if (Math.abs(stepDiff) !== 1) {
    transitionDelay =
      stepDiff > 0 ? Math.max(index.value + 1 - previousActive, 0) * 150 : -Math.max(index.value + 1 - active, 0) * 150;
  }

  const progress = status === (parent?.processStatus.value ?? "process") || status === "wait" ? 0 : 100;

  lineStyle.value = {
    transitionDelay: `${transitionDelay}ms`,
    borderWidth: progress && !isSimple.value ? "1px" : "0px",
    [isVertical.value ? "height" : "width"]: `${progress}%`
  };
}

function syncStatus(active: number, previousActive: number) {
  if (!parent || index.value < 0) {
    internalStatus.value = "wait";
    return;
  }

  const previousStep = parent.steps.value[index.value - 1];
  const previousStatus = previousStep?.internalStatus.value ?? "wait";

  if (active > index.value) {
    internalStatus.value = parent.finishStatus.value;
  } else if (active === index.value && previousStatus !== "error") {
    internalStatus.value = parent.processStatus.value;
  } else {
    internalStatus.value = "wait";
  }

  previousStep?.calcProgress(internalStatus.value, active, previousActive);
}

const stepState: StepState | null = currentInstance
  ? {
      uid: currentInstance.uid,
      el: itemRef,
      index,
      internalStatus,
      currentStatus,
      lineStyle,
      setIndex,
      calcProgress
    }
  : null;

watch(
  [
    () => parent?.active.value ?? 0,
    () => parent?.processStatus.value ?? "process",
    () => parent?.finishStatus.value ?? "finish",
    () => parent?.direction.value ?? "horizontal",
    () => parent?.simple.value ?? false
  ],
  ([active], previousValues) => {
    const previousActive = typeof previousValues?.[0] === "number" ? previousValues[0] : active;
    syncStatus(active, previousActive);
  },
  {
    immediate: true
  }
);

onMounted(() => {
  if (parent && stepState) {
    parent.addStep(stepState);
  }
});

onBeforeUnmount(() => {
  if (parent && currentInstance) {
    parent.removeStep(currentInstance.uid);
  }
});
</script>

<template>
  <div
    ref="itemRef"
    :class="itemClasses"
    :style="itemStyle"
    role="listitem"
    :aria-current="currentActive === index ? 'step' : undefined"
  >
    <div :class="headClasses">
      <div v-if="!isSimple" :class="`${ns.base.value}__line`" aria-hidden="true">
        <i :class="`${ns.base.value}__line-inner`" :style="lineStyle" />
      </div>

      <div :class="iconClasses">
        <slot name="icon">
          <span
            v-if="builtInIconName"
            :class="[`${ns.base.value}__icon-inner`, ns.is('status', isStatusIcon)]"
          >
            <XyIcon :icon="builtInIconName" :size="isSimple ? 16 : 18" />
          </span>
          <span v-else :class="`${ns.base.value}__icon-inner-text`">{{ index + 1 }}</span>
        </slot>
      </div>
    </div>

    <div :class="`${ns.base.value}__main`">
      <div :class="titleClasses">
        <slot name="title">{{ title }}</slot>
      </div>

      <div v-if="isSimple && !isLast" :class="`${ns.base.value}__arrow`" aria-hidden="true" />
      <div v-else-if="!isSimple && hasDescription" :class="descriptionClasses">
        <slot name="description">{{ description }}</slot>
      </div>
    </div>
  </div>
</template>
