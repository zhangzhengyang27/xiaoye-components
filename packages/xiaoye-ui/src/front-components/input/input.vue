<script setup lang="ts">
import { computed, ref, watch, nextTick } from "vue";
import type { InputProps } from "./input";

const props = withDefaults(defineProps<InputProps>(), {
  modelValue: "",
  type: "text",
  size: "md",
  disabled: false,
  readonly: false,
  clearable: false,
  showPassword: false,
  placeholder: "",
  rows: 3,
  resize: "vertical",
  autocomplete: "off",
  autofocus: false,
  name: ""
});

const emit = defineEmits<{
  "update:modelValue": [value: string | number];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
  clear: [event: Event];
  input: [event: Event];
  change: [event: Event];
}>();

const slots = defineSlots<{
  prefix?: () => unknown;
  suffix?: () => unknown;
  "clear-icon"?: () => unknown;
}>();

const ns = "xyu-input";
const inputRef = ref<HTMLInputElement | HTMLTextAreaElement | null>(null);
const focused = ref(false);
const showPwdVisible = ref(false);

const isTextarea = computed(() => props.type === "textarea");
const isPassword = computed(() => props.type === "password");
const nativeInputType = computed(() =>
  isPassword.value ? (showPwdVisible.value ? "text" : "password") : props.type
);

const inputValue = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val as string | number)
});

const showClear = computed(
  () =>
    props.clearable &&
    !props.disabled &&
    !props.readonly &&
    String(inputValue.value).length > 0
);

const showPrefixArea = computed(
  () => slots.prefix || props.prefixIcon || props.prefixText
);
const showSuffixArea = computed(
  () => slots.suffix || props.suffixIcon || props.suffixText || showClear.value || (isPassword.value && props.showPassword)
);

const wrapperClasses = computed(() => [
  `${ns}__wrapper`,
  `${ns}__wrapper--${props.size}`,
  {
    "is-disabled": props.disabled,
    "is-focused": focused.value,
    "is-readonly": props.readonly,
    "is-textarea": isTextarea.value,
    "has-prefix": showPrefixArea.value,
    "has-suffix": showSuffixArea.value
  }
]);

const textareaStyles = computed(() => {
  if (!isTextarea.value) return {};
  if (typeof props.autosize === "object") {
    return {
      resize: props.resize,
      minHeight: `${(props.autosize.minRows ?? 2) * 24 + 16}px`,
      maxHeight: `${(props.autosize.maxRows ?? 6) * 24 + 16}px`
    };
  }
  return { resize: props.resize };
});

function focus() {
  inputRef.value?.focus();
}

function blur() {
  inputRef.value?.blur();
}

function select() {
  (inputRef.value as HTMLInputElement)?.select();
}

function handleFocus(e: FocusEvent) {
  focused.value = true;
  emit("focus", e);
}

function handleBlur(e: FocusEvent) {
  focused.value = false;
  emit("blur", e);
}

function handleInput(e: Event) {
  const target = e.target as HTMLInputElement;
  emit("update:modelValue", target.value);
  emit("input", e);
}

function handleChange(e: Event) {
  emit("change", e);
}

function handleClear(e: Event) {
  e.stopPropagation();
  emit("update:modelValue", isTextarea.value ? "" : 0);
  emit("clear", e);
  nextTick(() => focus());
}

function togglePasswordVisibility() {
  showPwdVisible.value = !showPwdVisible.value;
}

defineExpose({ focus, blur, select });
</script>

<template>
  <div v-if="isTextarea" :class="wrapperClasses">
    <textarea
      :ref="(el) => { inputRef = el as HTMLTextAreaElement; }"
      v-model="inputValue"
      :class="`${ns}__inner`"
      :disabled="disabled"
      :readonly="readonly"
      :placeholder="placeholder"
      :rows="props.autosize ? undefined : rows"
      :maxlength="maxlength"
      :minlength="minlength"
      :autofocus="autofocus"
      :name="name"
      :style="textareaStyles"
      @focus="handleFocus"
      @blur="handleBlur"
      @input="handleInput"
      @change="handleChange"
    />
  </div>

  <div v-else :class="wrapperClasses">
    <span v-if="showPrefixArea" :class="`${ns}__prefix`">
      <slot v-if="slots.prefix" name="prefix" />
      <span v-else-if="prefixText" :class="`${ns}__prefix-text`">{{ prefixText }}</span>
    </span>

    <input
      :ref="(el) => { inputRef = el as HTMLInputElement; }"
      v-model="inputValue"
      :type="nativeInputType"
      :class="`${ns}__inner`"
      :disabled="disabled"
      :readonly="readonly"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :minlength="minlength"
      :autocomplete="autocomplete"
      :autofocus="autofocus"
      :name="name"
      @focus="handleFocus"
      @blur="handleBlur"
      @input="handleInput"
      @change="handleChange"
    />

    <span v-if="showSuffixArea" :class="`${ns}__suffix`">
      <slot v-if="slots.clear-icon" name="clear-icon" />
      <button
        v-else-if="showClear"
        :class="`${ns}__clear`"
        tabindex="-1"
        type="button"
        @click="handleClear"
        aria-label="清除"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <button
        v-if="isPassword && showPassword"
        :class="`${ns}__password-toggle`"
        tabindex="-1"
        type="button"
        @click="togglePasswordVisibility"
        :aria-label="showPwdVisible ? '隐藏密码' : '显示密码'"
      >
        <svg v-if="showPwdVisible" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
        <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>

      <slot v-if="slots.suffix" name="suffix" />
      <span v-else-if="suffixText" :class="`${ns}__suffix-text`">{{ suffixText }}</span>
    </span>
  </div>
</template>
