<script setup lang="ts">
defineOptions({
  inheritAttrs: false
});

import {
  computed,
  inject,
  nextTick,
  onMounted,
  ref,
  shallowRef,
  useAttrs,
  useSlots,
  watch
} from "vue";
import type { CSSProperties, StyleValue } from "vue";
import { useConfig, useNamespace } from "@xiaoye/composables";
import XyIcon from "../../icon";
import { formItemKey } from "../../form/src/context";
import {
  DEFAULT_CLEAR_ICON,
  DEFAULT_PASSWORD_HIDDEN_ICON,
  DEFAULT_PASSWORD_VISIBLE_ICON
} from "./input";
import type { InputAutoSize, InputProps } from "./input";

type InputValue = string | number;
type NativeInputElement = HTMLInputElement | HTMLTextAreaElement;

const props = withDefaults(defineProps<InputProps>(), {
  id: undefined,
  size: undefined,
  disabled: false,
  modelValue: "",
  modelModifiers: () => ({}),
  maxlength: undefined,
  minlength: undefined,
  type: "text",
  resize: "vertical",
  autosize: false,
  autocomplete: "off",
  formatter: undefined,
  parser: undefined,
  placeholder: "",
  form: undefined,
  readonly: false,
  clearable: false,
  clearIcon: DEFAULT_CLEAR_ICON,
  showPassword: false,
  showWordLimit: false,
  wordLimitPosition: "inside",
  suffixIcon: "",
  prefixIcon: "",
  containerRole: undefined,
  tabindex: undefined,
  validateEvent: true,
  inputStyle: "",
  autofocus: false,
  rows: 2,
  ariaLabel: undefined,
  inputmode: undefined,
  name: undefined
});

const emit = defineEmits<{
  "update:modelValue": [value: InputValue];
  input: [value: InputValue];
  change: [value: InputValue];
  clear: [];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
}>();

const attrs = useAttrs();
const slots = useSlots();
const formItem = inject(formItemKey, null);
const nsInput = useNamespace("input");
const nsTextarea = useNamespace("textarea");
const { size: globalSize } = useConfig();

const inputRef = shallowRef<HTMLInputElement | null>(null);
const textareaRef = shallowRef<HTMLTextAreaElement | null>(null);
const wrapperRef = ref<HTMLDivElement | null>(null);
const isFocused = ref(false);
const hovering = ref(false);
const passwordVisible = ref(false);
const isComposing = ref(false);
const textareaCalcStyle = ref<CSSProperties>({});
const displayValue = ref("");

const mergedSize = computed(() => props.size ?? globalSize.value);
const isTextarea = computed(() => props.type === "textarea");
const inputDisabled = computed(() => props.disabled || (formItem?.disabled.value ?? false));
const hasPrefix = computed(() => Boolean(slots.prefix) || Boolean(props.prefixIcon));
const hasSuffix = computed(() => Boolean(slots.suffix) || Boolean(props.suffixIcon));
const hasPrepend = computed(() => Boolean(slots.prepend));
const hasAppend = computed(() => Boolean(slots.append));
const hasValue = computed(() => displayValue.value.length > 0);
const inputId = computed(() => props.id ?? formItem?.inputId);
const messageId = computed(() => (formItem?.message.value ? formItem.messageId : undefined));
const validateState = computed(() => formItem?.validateState.value ?? "idle");
const nativeValue = computed(() => (props.modelValue == null ? "" : String(props.modelValue)));

function formatDisplayValue(value: string) {
  return props.formatter ? props.formatter(value) : value;
}

watch(
  () => props.modelValue,
  () => {
    displayValue.value = formatDisplayValue(nativeValue.value);
    nextTick(() => {
      syncNativeValue();
      resizeTextarea();
    });
  },
  {
    immediate: true
  }
);

const showClear = computed(
  () =>
    props.clearable &&
    !inputDisabled.value &&
    !props.readonly &&
    hasValue.value &&
    (hovering.value || isFocused.value)
);

const showPasswordVisible = computed(
  () =>
    !isTextarea.value &&
    props.showPassword &&
    !inputDisabled.value &&
    !props.readonly &&
    hasValue.value
);

const isWordLimitVisible = computed(
  () =>
    props.showWordLimit &&
    !props.showPassword &&
    !inputDisabled.value &&
    !props.readonly &&
    props.maxlength !== undefined &&
    props.maxlength !== null
);

const textLength = computed(() => nativeValue.value.length);
const inputExceed = computed(
  () => isWordLimitVisible.value && textLength.value > Number(props.maxlength)
);

const suffixVisible = computed(
  () => hasSuffix.value || showClear.value || showPasswordVisible.value || isWordLimitVisible.value
);

const containerKls = computed(() => [
  isTextarea.value ? nsTextarea.base.value : nsInput.base.value,
  `${(isTextarea.value ? nsTextarea : nsInput).base.value}--${mergedSize.value}`,
  validateState.value === "error" ? "is-error" : "",
  validateState.value === "success" ? "is-success" : "",
  inputDisabled.value ? "is-disabled" : "",
  isFocused.value ? "is-focus" : "",
  inputExceed.value ? "is-exceed" : "",
  hasPrefix.value ? "has-prefix" : "",
  suffixVisible.value ? "has-suffix" : "",
  hasPrepend.value ? "has-prepend" : "",
  hasAppend.value ? "has-append" : "",
  attrs.class
]);

const containerStyle = computed<StyleValue>(() => [attrs.style as StyleValue]);

const wrapperKls = computed(() => [`${nsInput.base.value}__wrapper`]);

const nativeAttrs = computed<Record<string, unknown>>(() => {
  const { class: _class, style: _style, ...rest } = attrs;
  return rest;
});

const currentInputType = computed(() => {
  if (isTextarea.value) {
    return undefined;
  }

  if (props.showPassword) {
    return passwordVisible.value ? "text" : "password";
  }

  return props.type;
});

const inputElementStyle = computed<StyleValue>(() => props.inputStyle);

const textareaStyle = computed<StyleValue>(() => [
  props.inputStyle,
  textareaCalcStyle.value,
  {
    resize: props.autosize ? "none" : props.resize
  }
]);

function applyModelModifiers(value: string): InputValue {
  let nextValue = value;

  if (props.modelModifiers.trim) {
    nextValue = nextValue.trim();
  }

  if (props.modelModifiers.number && nextValue !== "") {
    const parsed = Number(nextValue);
    return Number.isNaN(parsed) ? nextValue : parsed;
  }

  return nextValue;
}

function parseValue(value: string) {
  return props.parser ? props.parser(value) : value;
}

function syncNativeValue() {
  const value = displayValue.value;

  if (inputRef.value && inputRef.value.value !== value) {
    inputRef.value.value = value;
  }

  if (textareaRef.value && textareaRef.value.value !== value) {
    textareaRef.value.value = value;
  }
}

function resizeTextarea() {
  if (!isTextarea.value || !textareaRef.value) {
    return;
  }

  const textarea = textareaRef.value;

  if (!props.autosize) {
    textareaCalcStyle.value = {};
    return;
  }

  textarea.style.height = "auto";

  const style = window.getComputedStyle(textarea);
  const lineHeight = Number.parseFloat(style.lineHeight) || 22;
  const paddingTop = Number.parseFloat(style.paddingTop) || 0;
  const paddingBottom = Number.parseFloat(style.paddingBottom) || 0;
  const borderTop = Number.parseFloat(style.borderTopWidth) || 0;
  const borderBottom = Number.parseFloat(style.borderBottomWidth) || 0;
  const verticalExtras = paddingTop + paddingBottom + borderTop + borderBottom;

  let height = textarea.scrollHeight;
  let overflowY: CSSProperties["overflowY"] = "hidden";

  if (typeof props.autosize === "object") {
    const { minRows, maxRows } = props.autosize as Exclude<InputAutoSize, boolean>;

    if (minRows) {
      height = Math.max(height, minRows * lineHeight + verticalExtras);
    }

    if (maxRows) {
      const maxHeight = maxRows * lineHeight + verticalExtras;

      if (height > maxHeight) {
        height = maxHeight;
        overflowY = "auto";
      }
    }
  }

  textareaCalcStyle.value = {
    height: `${height}px`,
    overflowY
  };
}

function emitModelValue(value: string, source: "input" | "change") {
  const parsed = parseValue(value);
  const modelValue = applyModelModifiers(parsed);

  emit("update:modelValue", modelValue);

  if (source === "input") {
    emit("input", modelValue);
  } else {
    emit("change", modelValue);
  }

  return modelValue;
}

function handleInput(event: Event) {
  const target = event.target as NativeInputElement;
  const rawValue = target.value;

  if (isComposing.value) {
    displayValue.value = rawValue;
    emit("input", rawValue);
    return;
  }

  if (props.modelModifiers.lazy) {
    displayValue.value = props.formatter ? formatDisplayValue(parseValue(rawValue)) : rawValue;
    syncNativeValue();
    resizeTextarea();
    emit("input", applyModelModifiers(parseValue(rawValue)));
    return;
  }

  const modelValue = emitModelValue(rawValue, "input");
  displayValue.value = props.formatter
    ? formatDisplayValue(String(modelValue))
    : String(modelValue);

  nextTick(() => {
    syncNativeValue();
    resizeTextarea();
  });
}

async function handleChange(event: Event) {
  const value = (event.target as NativeInputElement).value;
  const modelValue = props.modelModifiers.lazy
    ? emitModelValue(value, "change")
    : applyModelModifiers(parseValue(value));

  if (!props.modelModifiers.lazy) {
    emit("change", modelValue);
  }

  if (props.validateEvent) {
    await formItem?.validate("change");
  }
}

function clear() {
  displayValue.value = "";
  emit("update:modelValue", "");
  emit("clear");
  emit("input", "");
  formItem?.clearValidate();

  nextTick(() => {
    syncNativeValue();
    resizeTextarea();
    inputRef.value?.focus();
  });
}

function handleFocus(event: FocusEvent) {
  isFocused.value = true;
  emit("focus", event);
}

async function handleBlur(event: FocusEvent) {
  isFocused.value = false;
  emit("blur", event);

  if (props.validateEvent) {
    await formItem?.validate("blur");
  }
}

function togglePasswordVisible() {
  passwordVisible.value = !passwordVisible.value;
  nextTick(() => {
    inputRef.value?.focus();
  });
}

function focus() {
  inputRef.value?.focus();
  textareaRef.value?.focus();
}

function blur() {
  inputRef.value?.blur();
  textareaRef.value?.blur();
}

function select() {
  inputRef.value?.select();
  textareaRef.value?.select();
}

function handleCompositionStart() {
  isComposing.value = true;
}

function handleCompositionEnd(event: CompositionEvent) {
  if (!isComposing.value) {
    return;
  }

  isComposing.value = false;
  handleInput(event as unknown as Event);
}

watch(
  () => props.type,
  () => {
    nextTick(() => {
      syncNativeValue();
      resizeTextarea();
    });
  }
);

onMounted(() => {
  syncNativeValue();
  resizeTextarea();
});

defineExpose({
  ref: computed(() => inputRef.value ?? textareaRef.value),
  input: inputRef,
  textarea: textareaRef,
  focus,
  blur,
  select,
  clear
});
</script>

<template>
  <div
    :class="containerKls"
    :style="containerStyle"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
  >
    <template v-if="!isTextarea">
      <div v-if="$slots.prepend" class="xy-input__prepend">
        <slot name="prepend" />
      </div>

      <div ref="wrapperRef" :class="wrapperKls">
        <span v-if="hasPrefix" class="xy-input__prefix">
          <slot name="prefix" />
          <XyIcon
            v-if="props.prefixIcon"
            class="xy-input__icon"
            :icon="props.prefixIcon"
            :size="16"
          />
        </span>

        <input
          :id="inputId"
          ref="inputRef"
          class="xy-input__inner"
          v-bind="nativeAttrs"
          :value="displayValue"
          :name="props.name"
          :minlength="props.minlength"
          :maxlength="props.maxlength"
          :type="currentInputType"
          :disabled="inputDisabled"
          :readonly="props.readonly"
          :autocomplete="props.autocomplete"
          :tabindex="props.tabindex"
          :aria-label="props.ariaLabel"
          :aria-describedby="messageId"
          :aria-invalid="validateState === 'error'"
          :placeholder="props.placeholder"
          :style="inputElementStyle"
          :form="props.form"
          :autofocus="props.autofocus"
          :role="props.containerRole"
          :inputmode="props.inputmode"
          @compositionstart="handleCompositionStart"
          @compositionend="handleCompositionEnd"
          @input="handleInput"
          @change="handleChange"
          @focus="handleFocus"
          @blur="handleBlur"
        />

        <span v-if="suffixVisible" class="xy-input__suffix">
          <template v-if="$slots.suffix">
            <slot name="suffix" />
          </template>
          <XyIcon
            v-if="props.suffixIcon"
            class="xy-input__icon"
            :icon="props.suffixIcon"
            :size="16"
          />
          <button
            v-if="showClear"
            class="xy-input__icon-button xy-input__clear"
            type="button"
            aria-label="clear"
            @mousedown.prevent
            @click="clear"
          >
            <XyIcon :icon="props.clearIcon" :size="16" />
          </button>
          <button
            v-if="showPasswordVisible"
            class="xy-input__icon-button xy-input__password"
            type="button"
            :aria-label="passwordVisible ? 'hide password' : 'show password'"
            @mousedown.prevent
            @click="togglePasswordVisible"
          >
            <slot name="password-icon" :visible="passwordVisible">
              <XyIcon
                :icon="
                  passwordVisible ? DEFAULT_PASSWORD_HIDDEN_ICON : DEFAULT_PASSWORD_VISIBLE_ICON
                "
                :size="16"
              />
            </slot>
          </button>
          <span
            v-if="isWordLimitVisible"
            :class="['xy-input__count', props.wordLimitPosition === 'outside' ? 'is-outside' : '']"
          >
            <span class="xy-input__count-inner">{{ textLength }} / {{ props.maxlength }}</span>
          </span>
        </span>
      </div>

      <div v-if="$slots.append" class="xy-input__append">
        <slot name="append" />
      </div>
    </template>

    <template v-else>
      <div class="xy-textarea__wrapper">
        <textarea
          :id="inputId"
          ref="textareaRef"
          class="xy-textarea__inner"
          v-bind="nativeAttrs"
          :value="displayValue"
          :name="props.name"
          :minlength="props.minlength"
          :maxlength="props.maxlength"
          :disabled="inputDisabled"
          :readonly="props.readonly"
          :autocomplete="props.autocomplete"
          :tabindex="props.tabindex"
          :aria-label="props.ariaLabel"
          :aria-describedby="messageId"
          :aria-invalid="validateState === 'error'"
          :placeholder="props.placeholder"
          :style="textareaStyle"
          :form="props.form"
          :autofocus="props.autofocus"
          :rows="props.rows"
          :role="props.containerRole"
          :inputmode="props.inputmode"
          @compositionstart="handleCompositionStart"
          @compositionend="handleCompositionEnd"
          @input="handleInput"
          @change="handleChange"
          @focus="handleFocus"
          @blur="handleBlur"
        />

        <button
          v-if="showClear"
          class="xy-textarea__icon-button xy-textarea__clear"
          type="button"
          aria-label="clear"
          @mousedown.prevent
          @click="clear"
        >
          <XyIcon :icon="props.clearIcon" :size="16" />
        </button>

        <span
          v-if="isWordLimitVisible"
          :class="[
            'xy-input__count',
            'xy-textarea__count',
            props.wordLimitPosition === 'outside' ? 'is-outside' : ''
          ]"
        >
          {{ textLength }} / {{ props.maxlength }}
        </span>
      </div>
    </template>
  </div>
</template>
