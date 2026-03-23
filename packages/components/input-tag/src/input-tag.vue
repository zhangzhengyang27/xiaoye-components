<script setup lang="ts">
defineOptions({
  inheritAttrs: false
});

import { computed, inject, nextTick, ref, shallowRef, useAttrs, useSlots, watch } from "vue";
import type { StyleValue } from "vue";
import { useConfig, useNamespace } from "@xiaoye/composables";
import XyIcon from "../../icon";
import XyTag from "../../tag";
import { formItemKey } from "../../form/src/context";
import { DEFAULT_CLEAR_ICON } from "./input-tag";
import type { InputTagProps, InputTagTrigger } from "./input-tag";

const props = withDefaults(defineProps<InputTagProps>(), {
  modelValue: undefined,
  max: undefined,
  trigger: "Enter",
  draggable: false,
  delimiter: "",
  size: undefined,
  disabled: false,
  readonly: false,
  clearable: false,
  clearIcon: DEFAULT_CLEAR_ICON,
  validateEvent: true,
  autofocus: false,
  id: undefined,
  tabindex: 0,
  maxlength: undefined,
  minlength: undefined,
  placeholder: "",
  autocomplete: "off",
  saveOnBlur: true,
  ariaLabel: undefined,
  name: undefined,
  tagStatus: "neutral",
  tagRound: false,
  inputmode: undefined,
  inputStyle: undefined
});

const emit = defineEmits<{
  "update:modelValue": [value: string[] | undefined];
  change: [value: string[] | undefined];
  input: [value: string];
  "add-tag": [value: string | string[]];
  "remove-tag": [value: string, index: number];
  "drag-tag": [draggingIndex: number, dropIndex: number, value: string];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
  clear: [];
}>();

const attrs = useAttrs();
const slots = useSlots();
const formItem = inject(formItemKey, null);
const ns = useNamespace("input-tag");
const { size: globalSize } = useConfig();

const inputRef = shallowRef<HTMLInputElement | null>(null);
const wrapperRef = ref<HTMLDivElement | null>(null);
const innerRef = ref<HTMLDivElement | null>(null);
const dropIndicatorRef = ref<HTMLSpanElement | null>(null);
const isFocused = ref(false);
const hovering = ref(false);
const isComposing = ref(false);
const inputValue = ref("");
const showDropIndicator = ref(false);

let draggingIndex: number | undefined;
let dropIndex: number | undefined;
let dropType: "before" | "after" | undefined;
let draggingElement: HTMLElement | null = null;

const mergedSize = computed(() => props.size ?? globalSize.value);
const currentTags = computed(() => props.modelValue ?? []);
const inputId = computed(() => props.id ?? formItem?.inputId);
const messageId = computed(() => (formItem?.message.value ? formItem.messageId : undefined));
const validateState = computed(() => formItem?.validateState.value ?? "idle");
const inputDisabled = computed(() => props.disabled);
const hasPrefix = computed(() => Boolean(slots.prefix));
const hasSuffix = computed(() => Boolean(slots.suffix));
const hasTags = computed(() => currentTags.value.length > 0);
const hasInputValue = computed(() => inputValue.value.trim().length > 0);
const canEdit = computed(() => !props.disabled && !props.readonly);
const tagDraggable = computed(() => props.draggable && canEdit.value);
const inputLimitReached = computed(
  () => props.max !== undefined && currentTags.value.length >= props.max
);
const showClear = computed(
  () =>
    props.clearable &&
    canEdit.value &&
    (hasTags.value || hasInputValue.value) &&
    (hovering.value || isFocused.value)
);
const showSuffix = computed(() => hasSuffix.value || showClear.value);
const placeholderText = computed(() =>
  hasTags.value || hasInputValue.value ? "" : props.placeholder
);

  const containerKls = computed(() => [
  ns.base.value,
  `${ns.base.value}--${mergedSize.value}`,
  validateState.value === "error" ? "is-error" : "",
  validateState.value === "success" ? "is-success" : "",
  inputDisabled.value ? "is-disabled" : "",
  isFocused.value ? "is-focus" : "",
  tagDraggable.value ? "is-draggable" : "",
  hasPrefix.value ? "has-prefix" : "",
  showSuffix.value ? "has-suffix" : "",
  attrs.class
]);

const containerStyle = computed<StyleValue>(() => [attrs.style as StyleValue]);
const inputElementStyle = computed<StyleValue>(() => props.inputStyle);

const nativeAttrs = computed<Record<string, unknown>>(() => {
  const { class: _class, style: _style, ...rest } = attrs;
  return rest;
});

function focus() {
  inputRef.value?.focus();
}

function blur() {
  inputRef.value?.blur();
}

function clearStaleValidation(nextTags: string[] | undefined) {
  if (!nextTags?.length) {
    return;
  }

  if (formItem?.validateState.value === "error") {
    formItem.clearValidate();
  }
}

async function triggerChangeValidation() {
  if (!props.validateEvent) {
    return;
  }

  await nextTick();
  await formItem?.validate("change");
}

async function triggerBlurValidation() {
  if (!props.validateEvent) {
    return;
  }

  await nextTick();
  await formItem?.validate("blur");
}

function normalizeTags(tags: string[]) {
  const normalized = tags
    .map((tag) => tag.trim())
    .filter(Boolean);

  if (props.max === undefined) {
    return normalized;
  }

  return normalized.slice(0, props.max);
}

function emitTagList(nextTags: string[], options?: { emitChange?: boolean }) {
  const normalized = normalizeTags(nextTags);
  const payload = normalized.length ? normalized : undefined;

  clearStaleValidation(payload);
  emit("update:modelValue", payload);

  if (options?.emitChange) {
    emit("change", payload);
  }
}

function getKeyTrigger(event: KeyboardEvent): InputTagTrigger | "" {
  if (event.key === "Enter" || event.code === "Enter" || event.code === "NumpadEnter") {
    return "Enter";
  }

  if (event.key === " " || event.key === "Spacebar" || event.code === "Space") {
    return "Space";
  }

  return "";
}

function syncInputValue() {
  if (inputRef.value && inputRef.value.value !== inputValue.value) {
    inputRef.value.value = inputValue.value;
  }
}

function splitByDelimiter(value: string) {
  if (!props.delimiter) {
    return {
      tags: [] as string[],
      remainder: value
    };
  }

  const parts =
    typeof props.delimiter === "string"
      ? value.split(props.delimiter)
      : value.split(props.delimiter);

  if (parts.length <= 1) {
    return {
      tags: [] as string[],
      remainder: value
    };
  }

  const remainder = parts.pop()?.trim() ?? "";

  return {
    tags: parts.map((part) => part.trim()).filter(Boolean),
    remainder
  };
}

async function addTags(rawTags: string | string[], remainder = "") {
  if (!canEdit.value) {
    return;
  }

  const incoming = Array.isArray(rawTags) ? rawTags : [rawTags];
  const normalizedIncoming = normalizeTags(incoming);
  const nextTags = normalizeTags([...currentTags.value, ...incoming]);
  const addedCount = Math.max(0, nextTags.length - currentTags.value.length);
  const addedTags = normalizedIncoming.slice(0, addedCount);

  inputValue.value = remainder;
  nextTick(() => {
    syncInputValue();
  });

  if (nextTags.length === currentTags.value.length) {
    return;
  }

  emitTagList(nextTags, { emitChange: true });
  emit("add-tag", Array.isArray(rawTags) ? addedTags : addedTags[0] ?? rawTags.trim());
  await triggerChangeValidation();
}

async function commitInput() {
  const value = inputValue.value.trim();

  if (!value || inputLimitReached.value) {
    inputValue.value = inputLimitReached.value ? "" : inputValue.value.trim();
    nextTick(() => {
      syncInputValue();
    });
    return;
  }

  await addTags(value, "");
}

async function removeTag(index: number) {
  if (!canEdit.value) {
    return;
  }

  const nextTags = currentTags.value.slice();
  const [removed] = nextTags.splice(index, 1);

  if (removed === undefined) {
    return;
  }

  emitTagList(nextTags, { emitChange: true });
  emit("remove-tag", removed, index);
  await triggerChangeValidation();
}

async function clearAll() {
  if (!canEdit.value) {
    return;
  }

  inputValue.value = "";
  emit("update:modelValue", undefined);
  emit("change", undefined);
  emit("clear");
  await triggerChangeValidation();
  nextTick(() => {
    syncInputValue();
    focus();
  });
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

function handleInput(event: Event) {
  const value = (event.target as HTMLInputElement).value;

  if (inputLimitReached.value) {
    inputValue.value = "";
    emit("input", "");
    nextTick(() => {
      syncInputValue();
    });
    return;
  }

  inputValue.value = value;

  if (isComposing.value) {
    emit("input", value);
    return;
  }

  const { tags: delimitedTags, remainder } = splitByDelimiter(value);

  if (delimitedTags.length) {
    void addTags(delimitedTags, remainder);
    emit("input", remainder);
    return;
  }

  if (value.trim()) {
    clearStaleValidation(currentTags.value.length ? currentTags.value : [value.trim()]);
  }

  emit("input", value);
}

async function handlePaste(event: ClipboardEvent) {
  if (!props.delimiter || !canEdit.value || inputLimitReached.value) {
    return;
  }

  const pastedText = event.clipboardData?.getData("text");

  if (!pastedText) {
    return;
  }

  const input = event.target as HTMLInputElement;
  const start = input.selectionStart ?? input.value.length;
  const end = input.selectionEnd ?? input.value.length;
  const nextValue = `${input.value.slice(0, start)}${pastedText}${input.value.slice(end)}`;
  const { tags: delimitedTags, remainder } = splitByDelimiter(nextValue);

  if (!delimitedTags.length) {
    return;
  }

  event.preventDefault();
  await addTags(delimitedTags, remainder);
  emit("input", remainder);
}

async function handleKeydown(event: KeyboardEvent) {
  if (!canEdit.value || isComposing.value) {
    return;
  }

  const trigger = getKeyTrigger(event);

  if (trigger && trigger === props.trigger) {
    event.preventDefault();
    event.stopPropagation();
    await commitInput();
    return;
  }

  if (event.key === "Backspace" && !inputValue.value && currentTags.value.length) {
    event.preventDefault();
    await removeTag(currentTags.value.length - 1);
  }
}

function handleFocus(event: FocusEvent) {
  isFocused.value = true;
  emit("focus", event);
}

async function handleBlur(event: FocusEvent) {
  isFocused.value = false;

  if (props.saveOnBlur) {
    await commitInput();
  } else {
    inputValue.value = "";
    nextTick(() => {
      syncInputValue();
    });
  }

  emit("blur", event);
  await triggerBlurValidation();
}

function updateDropIndicator(targetIndex: number, clientX: number) {
  if (!innerRef.value || !dropIndicatorRef.value || draggingIndex === undefined) {
    showDropIndicator.value = false;
    return;
  }

  if (draggingIndex === targetIndex) {
    showDropIndicator.value = false;
    dropType = undefined;
    dropIndex = undefined;
    return;
  }

  const tagElements = innerRef.value.querySelectorAll<HTMLElement>(".xy-input-tag__tag");
  const targetElement = tagElements[targetIndex];

  if (!targetElement) {
    showDropIndicator.value = false;
    return;
  }

  const rect = targetElement.getBoundingClientRect();
  const innerRect = innerRef.value.getBoundingClientRect();
  const midpoint = rect.left + rect.width / 2;
  const isImmediateNext = draggingIndex + 1 === targetIndex;
  const isImmediatePrev = draggingIndex - 1 === targetIndex;

  dropIndex = targetIndex;
  if (isImmediateNext) {
    dropType = clientX > midpoint ? "after" : undefined;
  } else if (isImmediatePrev) {
    dropType = clientX < midpoint ? "before" : undefined;
  } else {
    dropType = clientX <= midpoint ? "before" : "after";
  }

  if (!dropType) {
    showDropIndicator.value = false;
    return;
  }

  const left = dropType === "before" ? rect.left - innerRect.left : rect.right - innerRect.left;

  dropIndicatorRef.value.style.left = `${left}px`;
  dropIndicatorRef.value.style.top = `${rect.top - innerRect.top}px`;
  dropIndicatorRef.value.style.height = `${rect.height}px`;
  showDropIndicator.value = true;
}

function handleDragStart(event: DragEvent, index: number) {
  if (!tagDraggable.value) {
    event.preventDefault();
    return;
  }

  draggingIndex = index;
  draggingElement = event.currentTarget as HTMLElement;
  dropIndex = undefined;
  dropType = undefined;
  showDropIndicator.value = false;

  if (draggingElement) {
    draggingElement.style.opacity = "0.5";
  }

  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.dropEffect = "move";
    event.dataTransfer.setData("text/plain", `${index}`);
  }
}

function handleDragOver(event: DragEvent, index: number) {
  if (!tagDraggable.value || draggingIndex === undefined) {
    return;
  }

  event.preventDefault();

  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = "move";
  }

  updateDropIndicator(index, event.clientX);
}

async function handleDrop(event: DragEvent) {
  event.preventDefault();

  if (
    !dropType ||
    draggingIndex === undefined ||
    dropIndex === undefined ||
    draggingIndex === dropIndex
  ) {
    return;
  }

  const reordered = currentTags.value.slice();
  const [dragged] = reordered.splice(draggingIndex, 1);

  if (dragged !== undefined) {
    let targetPosition = dropType === "before" ? dropIndex : dropIndex + 1;

    if (draggingIndex < targetPosition) {
      targetPosition -= 1;
    }

    if (targetPosition === draggingIndex) {
      return;
    }

    reordered.splice(targetPosition, 0, dragged);
    emitTagList(reordered, { emitChange: true });
    emit("drag-tag", draggingIndex, targetPosition, dragged);
    await triggerChangeValidation();
    await nextTick();
    focus();
  }
}

function handleDragEnd(event?: DragEvent) {
  event?.preventDefault();

  if (draggingElement) {
    draggingElement.style.opacity = "";
  }

  showDropIndicator.value = false;
  draggingIndex = undefined;
  dropIndex = undefined;
  dropType = undefined;
  draggingElement = null;
}

watch(
  () => props.modelValue,
  (value) => {
    clearStaleValidation(value);
  }
);

defineExpose({
  input: inputRef,
  focus,
  blur,
  clear: clearAll
});
</script>

<template>
  <div
    :class="containerKls"
    :style="containerStyle"
    @click="focus"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
  >
    <div ref="wrapperRef" class="xy-input-tag__wrapper">
      <span v-if="hasPrefix" class="xy-input-tag__prefix">
        <slot name="prefix" />
      </span>

      <div ref="innerRef" class="xy-input-tag__inner">
        <XyTag
          v-for="(tag, index) in currentTags"
          :key="`${tag}-${index}`"
          class="xy-input-tag__tag"
          :size="mergedSize"
          :status="props.tagStatus"
          :round="props.tagRound"
          :closable="canEdit"
          :draggable="tagDraggable"
          @close="removeTag(index)"
          @dragstart="handleDragStart($event, index)"
          @dragover="handleDragOver($event, index)"
          @drop.stop="handleDrop"
          @dragend="handleDragEnd"
        >
          <slot name="tag" :value="tag" :index="index">
            {{ tag }}
          </slot>
        </XyTag>

        <div class="xy-input-tag__input-wrap">
          <input
            :id="inputId"
            ref="inputRef"
            v-bind="nativeAttrs"
            :value="inputValue"
            class="xy-input-tag__input"
            type="text"
            :name="props.name"
            :disabled="inputDisabled"
            :readonly="props.readonly || inputLimitReached"
            :tabindex="props.tabindex"
            :minlength="props.minlength"
            :maxlength="props.maxlength"
            :placeholder="placeholderText"
            :autocomplete="props.autocomplete"
            :autofocus="props.autofocus"
            :aria-label="props.ariaLabel"
            :aria-describedby="messageId"
            :aria-invalid="validateState === 'error'"
            :inputmode="props.inputmode"
            :style="inputElementStyle"
            @compositionstart="handleCompositionStart"
            @compositionend="handleCompositionEnd"
            @focus="handleFocus"
            @blur="handleBlur"
            @input="handleInput"
            @keydown="handleKeydown"
            @paste="handlePaste"
          />
        </div>

        <span
          v-show="showDropIndicator"
          ref="dropIndicatorRef"
          class="xy-input-tag__drop-indicator"
        />
      </div>

      <span v-if="showSuffix" class="xy-input-tag__suffix">
        <slot name="suffix" />
        <button
          v-if="showClear"
          class="xy-input-tag__icon-button xy-input-tag__clear"
          type="button"
          aria-label="clear"
          @mousedown.prevent
          @click.stop="clearAll"
        >
          <XyIcon :icon="props.clearIcon" :size="16" />
        </button>
      </span>
    </div>
  </div>
</template>
