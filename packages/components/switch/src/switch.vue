<script setup lang="ts">
defineOptions({
  inheritAttrs: false
});

import { computed, inject, nextTick, shallowRef, useAttrs, useSlots, watch } from "vue";
import type { ComputedRef, StyleValue } from "vue";
import { useConfig, useNamespace } from "@xiaoye/composables";
import XyIcon from "../../icon";
import { formItemKey } from "../../form/src/context";
import { DEFAULT_LOADING_ICON } from "./switch";
import type { SwitchProps, SwitchValue } from "./switch";

const props = withDefaults(defineProps<SwitchProps>(), {
  modelValue: false,
  disabled: false,
  loading: false,
  size: undefined,
  width: undefined,
  inlinePrompt: false,
  inactiveActionIcon: "",
  activeActionIcon: "",
  activeIcon: "",
  inactiveIcon: "",
  activeText: "",
  inactiveText: "",
  activeValue: true,
  inactiveValue: false,
  name: undefined,
  validateEvent: true,
  beforeChange: undefined,
  id: undefined,
  tabindex: undefined,
  ariaLabel: undefined
});

const emit = defineEmits<{
  "update:modelValue": [value: SwitchValue];
  change: [value: SwitchValue];
  input: [value: SwitchValue];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
}>();

const attrs = useAttrs();
const slots = useSlots();
const formItem = inject(formItemKey, null);
const ns = useNamespace("switch");
const { size: globalSize } = useConfig();

const inputRef = shallowRef<HTMLInputElement | null>(null);
const isFocused = shallowRef(false);
const pending = shallowRef(false);

const mergedSize = computed(() => props.size ?? globalSize.value);
const switchChecked = computed(() => props.modelValue === props.activeValue);
const switchDisabled = computed(() => props.disabled || props.loading || pending.value);
const inputId = computed(() => props.id ?? formItem?.inputId);
const messageId = computed(() => (formItem?.message.value ? formItem.messageId : undefined));
const validateState = computed(() => formItem?.validateState.value ?? "idle");

const hasInactiveLabel = computed(
  () =>
    !props.inlinePrompt &&
    (Boolean(slots.inactive) || Boolean(props.inactiveIcon) || Boolean(props.inactiveText))
);
const hasActiveLabel = computed(
  () =>
    !props.inlinePrompt &&
    (Boolean(slots.active) || Boolean(props.activeIcon) || Boolean(props.activeText))
);

const switchKls = computed(() => [
  ns.base.value,
  `${ns.base.value}--${mergedSize.value}`,
  switchChecked.value ? "is-checked" : "",
  switchDisabled.value ? "is-disabled" : "",
  props.loading || pending.value ? "is-loading" : "",
  isFocused.value ? "is-focus" : "",
  props.inlinePrompt ? "is-inline-prompt" : "",
  validateState.value === "error" ? "is-error" : "",
  validateState.value === "success" ? "is-success" : "",
  attrs.class
]);

const containerStyle = computed<StyleValue>(() => [attrs.style as StyleValue]);

const coreStyle = computed<Record<string, string>>(() => {
  if (props.width === undefined || props.width === null || props.width === "") {
    return {};
  }

  return {
    [ns.cssVarBlock("width")]:
      typeof props.width === "number" ? `${props.width}px` : String(props.width)
  };
});

const nativeAttrs = computed<Record<string, unknown>>(() => {
  const { class: _class, style: _style, ...rest } = attrs;
  return rest;
});

function syncInputChecked() {
  if (inputRef.value) {
    inputRef.value.checked = switchChecked.value;
  }
}

watch(
  switchChecked,
  () => {
    nextTick(() => {
      syncInputChecked();
    });
  },
  {
    immediate: true
  }
);

async function validateChange() {
  if (!props.validateEvent) {
    return;
  }

  await nextTick();
  await formItem?.validate("change");
}

async function emitValue(value: SwitchValue) {
  emit("update:modelValue", value);
  emit("input", value);
  emit("change", value);
  await validateChange();
  await nextTick();
  syncInputChecked();
}

function isPromiseLike(value: unknown): value is Promise<boolean> {
  return Boolean(
    value &&
      typeof value === "object" &&
      "then" in value &&
      typeof (value as Promise<boolean>).then === "function"
  );
}

async function canSwitch() {
  if (!props.beforeChange) {
    return true;
  }

  const result = props.beforeChange();

  if (typeof result === "boolean") {
    return result;
  }

  if (!isPromiseLike(result)) {
    console.warn("[XySwitch] beforeChange 必须返回 boolean 或 Promise<boolean>。");
    return false;
  }

  pending.value = true;

  try {
    return await result;
  } catch {
    return false;
  } finally {
    pending.value = false;
    nextTick(() => {
      syncInputChecked();
    });
  }
}

async function switchValue() {
  if (switchDisabled.value) {
    syncInputChecked();
    return;
  }

  const allowed = await canSwitch();

  if (!allowed) {
    syncInputChecked();
    return;
  }

  const value = switchChecked.value ? props.inactiveValue : props.activeValue;
  await emitValue(value);
}

async function handleChange() {
  await switchValue();
}

function handleFocus(event: FocusEvent) {
  isFocused.value = true;
  emit("focus", event);
}

function handleBlur(event: FocusEvent) {
  isFocused.value = false;
  emit("blur", event);
}

function focus() {
  inputRef.value?.focus();
}

const exposedChecked: ComputedRef<boolean> = computed(() => switchChecked.value);

defineExpose({
  focus,
  checked: exposedChecked
});
</script>

<template>
  <div :class="switchKls" :style="containerStyle" @click.prevent="switchValue">
    <input
      :id="inputId"
      ref="inputRef"
      class="xy-switch__input"
      v-bind="nativeAttrs"
      type="checkbox"
      role="switch"
      :aria-checked="switchChecked"
      :aria-disabled="switchDisabled"
      :aria-invalid="validateState === 'error'"
      :aria-label="props.ariaLabel"
      :aria-describedby="messageId"
      :name="props.name"
      :disabled="switchDisabled"
      :tabindex="props.tabindex"
      @click.stop
      @change="handleChange"
      @keydown.enter.prevent="switchValue"
      @focus="handleFocus"
      @blur="handleBlur"
    />

    <span
      v-if="hasInactiveLabel"
      class="xy-switch__label xy-switch__label--left"
      :class="{ 'is-active': !switchChecked }"
    >
      <slot name="inactive">
        <XyIcon v-if="props.inactiveIcon" :icon="props.inactiveIcon" :size="14" />
        <span v-else-if="props.inactiveText" :aria-hidden="switchChecked">
          {{ props.inactiveText }}
        </span>
      </slot>
    </span>

    <span class="xy-switch__core" :style="coreStyle">
      <span v-if="props.inlinePrompt" class="xy-switch__inner">
        <span class="xy-switch__inner-wrapper">
          <template v-if="switchChecked">
            <slot name="active">
              <XyIcon v-if="props.activeIcon" :icon="props.activeIcon" :size="12" />
              <span v-else-if="props.activeText">{{ props.activeText }}</span>
            </slot>
          </template>
          <template v-else>
            <slot name="inactive">
              <XyIcon v-if="props.inactiveIcon" :icon="props.inactiveIcon" :size="12" />
              <span v-else-if="props.inactiveText">{{ props.inactiveText }}</span>
            </slot>
          </template>
        </span>
      </span>

      <span class="xy-switch__action">
        <XyIcon
          v-if="props.loading || pending"
          :icon="DEFAULT_LOADING_ICON"
          :size="12"
          spin
        />
        <template v-else-if="switchChecked">
          <slot name="active-action">
            <XyIcon v-if="props.activeActionIcon" :icon="props.activeActionIcon" :size="12" />
          </slot>
        </template>
        <template v-else>
          <slot name="inactive-action">
            <XyIcon
              v-if="props.inactiveActionIcon"
              :icon="props.inactiveActionIcon"
              :size="12"
            />
          </slot>
        </template>
      </span>
    </span>

    <span
      v-if="hasActiveLabel"
      class="xy-switch__label xy-switch__label--right"
      :class="{ 'is-active': switchChecked }"
    >
      <slot name="active">
        <XyIcon v-if="props.activeIcon" :icon="props.activeIcon" :size="14" />
        <span v-else-if="props.activeText" :aria-hidden="!switchChecked">
          {{ props.activeText }}
        </span>
      </slot>
    </span>
  </div>
</template>
