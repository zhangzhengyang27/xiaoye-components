<script setup lang="ts">
defineOptions({
  inheritAttrs: false
});

import { computed, inject, nextTick, ref, shallowRef, useAttrs, watch } from "vue";
import { useConfig, useNamespace } from "@xiaoye/composables";
import XyIcon from "../../icon";
import { formItemKey } from "../../form/src/context";
import {
  DEFAULT_RATE_COLORS,
  DEFAULT_RATE_DISABLED_VOID_ICON,
  DEFAULT_RATE_ICONS,
  DEFAULT_RATE_TEXTS,
  DEFAULT_RATE_VOID_ICON
} from "./rate";
import type { RateColorMap, RateIconMap, RateProps } from "./rate";

type ThresholdValue<T> = T | { value: T; excluded?: boolean };

const props = withDefaults(defineProps<RateProps>(), {
  modelValue: 0,
  id: undefined,
  lowThreshold: 2,
  highThreshold: 4,
  max: 5,
  colors: () => [...DEFAULT_RATE_COLORS] as RateColorMap,
  voidColor: "",
  disabledVoidColor: "",
  icons: () => [...DEFAULT_RATE_ICONS] as RateIconMap,
  voidIcon: DEFAULT_RATE_VOID_ICON,
  disabledVoidIcon: DEFAULT_RATE_DISABLED_VOID_ICON,
  disabled: false,
  allowHalf: false,
  showText: false,
  showScore: false,
  textColor: "",
  texts: () => [...DEFAULT_RATE_TEXTS],
  scoreTemplate: "{value}",
  size: undefined,
  clearable: false,
  ariaLabel: undefined,
  validateEvent: true
});

const emit = defineEmits<{
  "update:modelValue": [value: number];
  change: [value: number];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
}>();

const attrs = useAttrs();
const formItem = inject(formItemKey, null);
const ns = useNamespace("rate");
const { size: globalSize } = useConfig();

const rootRef = shallowRef<HTMLElement | null>(null);
const currentValue = ref(0);
const hoverIndex = ref(-1);
const pointerAtLeftHalf = ref(false);
const isFocused = ref(false);

const mergedSize = computed(() => props.size ?? globalSize.value);
const inputId = computed(() => props.id ?? formItem?.inputId);
const messageId = computed(() => (formItem?.message.value ? formItem.messageId : undefined));
const validateState = computed(() => formItem?.validateState.value ?? "idle");
const normalizedModelValue = computed(() => clampValue(props.modelValue));

const rootKls = computed(() => [
  ns.base.value,
  `${ns.base.value}--${mergedSize.value}`,
  ns.is("disabled", props.disabled),
  ns.is("focused", isFocused.value),
  attrs.class
]);

const nativeAttrs = computed<Record<string, unknown>>(() => {
  const rest = { ...attrs };
  delete rest.class;
  delete rest.style;
  return rest;
});

const colorMap = computed<Record<number, ThresholdValue<string>>>(() =>
  normalizeThresholdMap(props.colors, DEFAULT_RATE_COLORS, props.lowThreshold, props.highThreshold, props.max)
);

const iconMap = computed<Record<number, ThresholdValue<string>>>(() =>
  normalizeThresholdMap(props.icons, DEFAULT_RATE_ICONS, props.lowThreshold, props.highThreshold, props.max)
);

const activeColor = computed(() => getValueFromMap(currentValue.value, colorMap.value) ?? "");
const activeIcon = computed(
  () => getValueFromMap(currentValue.value, iconMap.value) ?? DEFAULT_RATE_ICONS[2]
);
const voidIcon = computed(() =>
  props.disabled ? props.disabledVoidIcon || DEFAULT_RATE_DISABLED_VOID_ICON : props.voidIcon || DEFAULT_RATE_VOID_ICON
);

const rootStyle = computed(() => ({
  [ns.cssVarBlock("fill-color")]: activeColor.value || undefined,
  [ns.cssVarBlock("void-color")]:
    props.disabled && props.disabledVoidColor ? props.disabledVoidColor : props.voidColor || undefined,
  [ns.cssVarBlock("disabled-void-color")]: props.disabledVoidColor || undefined
}));

const text = computed(() => {
  if (props.showScore) {
    const displayValue = props.disabled ? normalizedModelValue.value : currentValue.value;
    return props.scoreTemplate.replace(/\{\s*value\s*\}/g, String(displayValue));
  }

  if (props.showText) {
    const textIndex = Math.ceil(currentValue.value) - 1;
    return textIndex >= 0 ? props.texts[textIndex] ?? "" : "";
  }

  return "";
});

function clampValue(value: number | null | undefined) {
  if (typeof value !== "number" || Number.isNaN(value) || !Number.isFinite(value)) {
    return 0;
  }

  return Math.min(props.max, Math.max(0, value));
}

function normalizeThresholdMap<T>(
  value: T[] | Record<number, T>,
  fallback: readonly T[],
  lowThreshold: number,
  highThreshold: number,
  max: number
) {
  if (Array.isArray(value)) {
    const [low = fallback[0], medium = fallback[1], high = fallback[2]] = value;

    return {
      [lowThreshold]: low,
      [highThreshold]: {
        value: medium,
        excluded: true
      },
      [max]: high
    } satisfies Record<number, ThresholdValue<T>>;
  }

  return value as Record<number, ThresholdValue<T>>;
}

function getValueFromMap<T>(value: number, map: Record<number, ThresholdValue<T>>) {
  const matchedKeys = Object.keys(map)
    .map(Number)
    .filter((key) => {
      const matched = map[key];

      if (typeof matched === "object" && matched !== null && "value" in matched) {
        return matched.excluded ? value < key : value <= key;
      }

      return value <= key;
    })
    .sort((a, b) => a - b);

  const matchedValue = map[matchedKeys[0]];

  if (typeof matchedValue === "object" && matchedValue !== null && "value" in matchedValue) {
    return matchedValue.value;
  }

  return matchedValue;
}

function syncFromModel() {
  currentValue.value = normalizedModelValue.value;
  pointerAtLeftHalf.value = currentValue.value % 1 !== 0;
}

function getNextFill(item: number) {
  const whole = Math.floor(currentValue.value);

  if (item <= whole) {
    return 100;
  }

  const fraction = currentValue.value - whole;

  if (item === whole + 1 && (props.allowHalf || props.disabled) && fraction > 0) {
    return fraction * 100;
  }

  return 0;
}

function emitValue(value: number) {
  let nextValue = clampValue(value);

  if (props.allowHalf) {
    nextValue = Math.round(nextValue * 2) / 2;
  } else {
    nextValue = Math.round(nextValue);
  }

  if (props.clearable && nextValue === normalizedModelValue.value) {
    nextValue = 0;
  }

  currentValue.value = nextValue;
  pointerAtLeftHalf.value = nextValue % 1 !== 0;
  hoverIndex.value = -1;

  emit("update:modelValue", nextValue);

  if (nextValue !== normalizedModelValue.value) {
    emit("change", nextValue);
  }

  if (props.validateEvent) {
    void nextTick(() => formItem?.validate("change"));
  }
}

function setCurrentValue(value: number, event?: MouseEvent) {
  if (props.disabled) {
    return;
  }

  let nextValue = value;

  if (props.allowHalf && event) {
    const currentTarget = event.currentTarget as HTMLElement | null;
    const rect = currentTarget?.getBoundingClientRect();
    const width = rect?.width || currentTarget?.clientWidth || 16;
    const left = rect?.left ?? 0;
    const offset = event.clientX - left;

    pointerAtLeftHalf.value = offset <= width / 2;
    nextValue = pointerAtLeftHalf.value ? value - 0.5 : value;
  } else {
    pointerAtLeftHalf.value = false;
  }

  currentValue.value = clampValue(nextValue);
  hoverIndex.value = value;
}

function resetCurrentValue() {
  if (props.disabled) {
    return;
  }

  syncFromModel();
  hoverIndex.value = -1;
}

function selectValue(value: number) {
  if (props.disabled) {
    return;
  }

  emitValue(props.allowHalf && pointerAtLeftHalf.value ? value - 0.5 : value);
}

function handleKey(event: KeyboardEvent) {
  if (props.disabled) {
    return;
  }

  const step = props.allowHalf ? 0.5 : 1;
  let nextValue = currentValue.value;

  switch (event.key) {
    case "ArrowRight":
    case "ArrowUp":
      nextValue += step;
      break;
    case "ArrowLeft":
    case "ArrowDown":
      nextValue -= step;
      break;
    default:
      return;
  }

  nextValue = clampValue(nextValue);

  if (nextValue === currentValue.value) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  emitValue(nextValue);
}

function handleFocus(event: FocusEvent) {
  isFocused.value = true;
  emit("focus", event);
}

function handleBlur(event: FocusEvent) {
  isFocused.value = false;
  hoverIndex.value = -1;
  syncFromModel();
  emit("blur", event);

  if (props.validateEvent) {
    void nextTick(() => formItem?.validate("blur"));
  }
}

function focus() {
  rootRef.value?.focus();
}

function blur() {
  rootRef.value?.blur();
}

watch(
  () => [props.modelValue, props.max],
  () => {
    syncFromModel();
  },
  {
    immediate: true
  }
);

defineExpose({
  root: rootRef,
  focus,
  blur,
  setCurrentValue,
  resetCurrentValue
});
</script>

<template>
  <div
    :id="inputId"
    ref="rootRef"
    :class="rootKls"
    :style="[rootStyle, attrs.style]"
    role="slider"
    :tabindex="props.disabled ? undefined : 0"
    :aria-label="props.ariaLabel ?? '评分'"
    :aria-valuenow="currentValue"
    aria-valuemin="0"
    :aria-valuemax="props.max"
    :aria-valuetext="text || undefined"
    :aria-disabled="props.disabled"
    :aria-invalid="validateState === 'error' ? 'true' : undefined"
    :aria-describedby="messageId"
    v-bind="nativeAttrs"
    @keydown="handleKey"
    @focus="handleFocus"
    @blur="handleBlur"
    @mouseleave="resetCurrentValue"
  >
    <button
      v-for="item in props.max"
      :key="item"
      class="xy-rate__item"
      :class="[
        ns.is('active', item <= currentValue),
        ns.is('hover', hoverIndex === item),
        ns.is('current', item === Math.ceil(currentValue || 1))
      ]"
      type="button"
      :disabled="props.disabled"
      tabindex="-1"
      :aria-hidden="true"
      @mousemove="setCurrentValue(item, $event)"
      @click="selectValue(item)"
    >
      <span class="xy-rate__icon-layer xy-rate__icon-layer--void" aria-hidden="true">
        <XyIcon :icon="voidIcon" />
      </span>
      <span
        class="xy-rate__icon-layer xy-rate__icon-layer--filled"
        :style="{ width: `${getNextFill(item)}%` }"
        aria-hidden="true"
      >
        <XyIcon :icon="activeIcon" />
      </span>
    </button>

    <span
      v-if="props.showText || props.showScore"
      class="xy-rate__text"
      :style="{ color: props.textColor || undefined }"
    >
      {{ text }}
    </span>
  </div>
</template>
