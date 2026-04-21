<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import type { InputTagProps } from "./input-tag";

const props = withDefaults(defineProps<InputTagProps>(), {
  modelValue: () => [],
  size: "md",
  type: "text",
  placeholder: "输入标签后按回车",
  max: Infinity,
  disabled: false,
  readonly: false,
  clearable: false,
  allowDuplicate: false,
  split: ","
});

const emit = defineEmits<{
  "update:modelValue": [value: string[]];
  change: [value: string[]];
  add: [tag: string];
  remove: [tag: string, index: number];
  clear: [];
}>();

const ns = "xyu-input-tag";
const inputRef = ref<HTMLInputElement | null>(null);
const inputValue = ref("");
const isFocused = ref(false);

const tags = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit("update:modelValue", val);
    emit("change", val);
  }
});

const canAddMore = computed(() => tags.value.length < props.max);

const containerClasses = computed(() => [
  ns,
  `${ns}--${props.size}`,
  isFocused.value ? "is-focused" : "",
  props.disabled ? "is-disabled" : ""
]);

const wrapperClasses = computed(() => [
  `${ns}__wrapper`,
  isFocused.value ? "is-focused" : "",
  props.disabled ? "is-disabled" : ""
]);

const inputClasses = computed(() => `${ns}__input`);

function focus() {
  inputRef.value?.focus();
}

function handleWrapperClick() {
  if (!props.disabled && !props.readonly) {
    focus();
  }
}

function handleInputKeydown(e: KeyboardEvent) {
  if (e.key === "Enter") {
    e.preventDefault();
    addTag();
  } else if (e.key === "Backspace" && inputValue.value === "" && tags.value.length > 0) {
    removeTag(tags.value.length - 1);
  } else if (e.key === props.split && props.split !== "Enter") {
    e.preventDefault();
    addTag();
  }
}

function addTag() {
  const raw = inputValue.value.trim();
  if (!raw) return;
  if (!canAddMore.value) return;

  const newTags = raw.split(props.split).map((t) => t.trim()).filter(Boolean);

  let finalTags = [...tags.value];
  for (const tag of newTags) {
    if (finalTags.length >= props.max) break;
    if (!props.allowDuplicate && finalTags.includes(tag)) continue;
    finalTags.push(tag);
    emit("add", tag);
  }

  if (finalTags.length !== tags.value.length) {
    tags.value = finalTags;
  }
  inputValue.value = "";
}

function removeTag(index: number) {
  const removed = tags.value[index];
  const newTags = tags.value.filter((_, i) => i !== index);
  tags.value = newTags;
  emit("remove", removed, index);
}

function handleClear() {
  tags.value = [];
  emit("clear");
}

defineExpose({ focus, addTag, removeTag });
</script>

<template>
  <div :class="containerClasses" @click="handleWrapperClick">
    <div :class="wrapperClasses">
      <!-- Tags -->
      <span
        v-for="(tag, index) in tags"
        :key="`${tag}-${index}`"
        :class="[`${ns}__tag`, props.tagType ? `${ns}__tag--${props.tagType}` : '']"
      >
        <span :class="`${ns}__tag-text`">{{ tag }}</span>
        <button
          v-if="!props.disabled && !props.readonly"
          type="button"
          :class="`${ns}__tag-remove`"
          @click.stop="removeTag(index)"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </span>

      <!-- Input -->
      <input
        v-if="canAddMore"
        ref="inputRef"
        v-model="inputValue"
        :class="inputClasses"
        :type="props.type"
        :placeholder="tags.length === 0 ? props.placeholder : ''"
        :disabled="props.disabled"
        :readonly="props.readonly"
        :maxlength="props.maxlength"
        @focus="isFocused = true"
        @blur="isFocused = false"
        @keydown="handleInputKeydown"
        @paste.prevent="(e) => { inputValue = e.clipboardData?.getData('text') ?? ''; }"
      />

      <!-- Clear button -->
      <button
        v-if="props.clearable && tags.length > 0 && !props.disabled"
        type="button"
        :class="`${ns}__clear`"
        @click.stop="handleClear"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      </button>
    </div>
  </div>
</template>
