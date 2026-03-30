<script setup lang="ts" generic="T extends string | number">
import { computed, getCurrentInstance, inject, nextTick, ref, watch } from "vue";
import type { ComponentPublicInstance, StyleValue } from "vue";
import {
  useConfig,
  useDismissibleLayer,
  useFloatingPanel,
  useListNavigation,
  useNamespace,
  useOverlayStack
} from "@xiaoye/composables";
import XyInput from "../../input";
import { formItemKey } from "../../form/src/context";
import { XyLoadingIndicator, resolveLoadingVisualConfig } from "../../loading/src/shared";
import type { AutoCompleteOption, AutoCompleteProps } from "./auto-complete";

type InputExpose = ComponentPublicInstance<{
  focus: () => void;
  blur: () => void;
}>;

const props = withDefaults(defineProps<AutoCompleteProps<T>>(), {
  modelValue: "",
  placeholder: "请输入关键词",
  disabled: false,
  clearable: false,
  remote: false,
  loading: false,
  loadingText: "加载中",
  size: undefined,
  prefixIcon: "",
  suffixIcon: "",
  teleported: true,
  appendTo: "body",
  placement: "bottom-start",
  offset: 8,
  popperClass: "",
  popperStyle: "",
  dropdownMinWidth: undefined,
  dropdownMaxWidth: undefined
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
  change: [value: string];
  clear: [];
  visibleChange: [value: boolean];
  focus: [];
  blur: [];
  searchChange: [value: string];
  select: [option: AutoCompleteOption<T>];
}>();

const instance = getCurrentInstance();
const formItem = inject(formItemKey, null);
const ns = useNamespace("auto-complete");
const { size: globalSize, loading: globalLoading } = useConfig();
const mergedSize = computed(() => props.size ?? globalSize.value);
const mergedDisabled = computed(() => props.disabled || Boolean(formItem?.disabled.value));
const triggerRef = ref<HTMLElement | null>(null);
const dropdownRef = ref<HTMLElement | null>(null);
const dropdownArrowRef = ref<HTMLElement | null>(null);
const inputRef = ref<InputExpose | null>(null);
const open = ref(false);
const inputValue = ref(props.modelValue);
const listboxId = `xy-auto-complete-listbox-${Math.random().toString(36).slice(2, 10)}`;
const { zIndex, isTopMost, openLayer, closeLayer } = useOverlayStack();
const hasLoadingTextProp = computed(() => {
  const vnodeProps = instance?.vnode.props ?? {};
  return "loadingText" in vnodeProps || "loading-text" in vnodeProps;
});
const resolvedLoading = computed(() =>
  resolveLoadingVisualConfig(
    globalLoading.value,
    "加载中",
    hasLoadingTextProp.value,
    props.loadingText
  )
);

const filteredOptions = computed(() => {
  if (props.remote) {
    return props.options;
  }

  const keyword = inputValue.value.trim().toLowerCase();

  if (!keyword) {
    return props.options;
  }

  return props.options.filter((option) => option.label.toLowerCase().includes(keyword));
});

const emptyText = computed(() => (props.loading ? props.loadingText : "暂无建议"));

const navigation = useListNavigation(() => filteredOptions.value, {
  loop: true
});

const {
  actualPlacement,
  arrowStyle,
  floatingStyle,
  updatePosition,
  startAutoUpdate,
  stopAutoUpdate
} = useFloatingPanel(triggerRef, dropdownRef, {
  arrowRef: dropdownArrowRef,
  placement: computed(() => props.placement),
  offset: computed(() => props.offset),
  matchTriggerWidth: true,
  zIndex
});

function addUnit(value: string | number | undefined) {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  return typeof value === "number" ? `${value}px` : value;
}

const dropdownStyle = computed<StyleValue>(() => [
  floatingStyle.value,
  props.dropdownMinWidth || props.dropdownMaxWidth
    ? {
        minWidth: addUnit(props.dropdownMinWidth),
        maxWidth: addUnit(props.dropdownMaxWidth)
      }
    : undefined,
  props.popperStyle
]);

function syncActiveIndex() {
  if (!filteredOptions.value.length) {
    navigation.clearActiveIndex();
    return;
  }

  navigation.activateFirst();
}

async function openDropdown() {
  if (mergedDisabled.value || open.value) {
    return;
  }

  open.value = true;
  emit("visibleChange", true);
  emit("focus");
  openLayer();
  syncActiveIndex();

  await nextTick();
  await updatePosition();
  startAutoUpdate();
}

async function closeDropdown(shouldValidate = false, restoreFocus = false) {
  if (!open.value) {
    return;
  }

  open.value = false;
  emit("visibleChange", false);
  emit("blur");
  stopAutoUpdate();
  closeLayer();
  navigation.clearActiveIndex();

  if (restoreFocus) {
    await nextTick();
    inputRef.value?.focus();
  }

  if (shouldValidate) {
    await formItem?.validate("blur");
  }
}

async function emitInputValue(value: string) {
  inputValue.value = value;
  emit("update:modelValue", value);
  emit("searchChange", value);

  if (!open.value) {
    await openDropdown();
    return;
  }

  await nextTick();
  syncActiveIndex();
  await updatePosition();
}

async function selectOption(option: AutoCompleteOption<T>) {
  if (option.disabled) {
    return;
  }

  inputValue.value = option.label;
  emit("update:modelValue", option.label);
  emit("change", option.label);
  emit("select", option);
  await closeDropdown(false, true);
  await formItem?.validate("change");
}

async function clearValue() {
  inputValue.value = "";
  emit("update:modelValue", "");
  emit("change", "");
  emit("searchChange", "");
  emit("clear");
  await formItem?.validate("change");
}

async function handleFocus() {
  await openDropdown();
}

async function handleKeydown(event: KeyboardEvent) {
  if (mergedDisabled.value) {
    return;
  }

  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      if (!open.value) {
        await openDropdown();
      } else {
        navigation.moveNext();
      }
      break;
    case "ArrowUp":
      event.preventDefault();
      if (!open.value) {
        await openDropdown();
      } else {
        navigation.movePrev();
      }
      break;
    case "Enter":
      if (!open.value || !navigation.activeItem.value) {
        return;
      }

      event.preventDefault();
      await selectOption(navigation.activeItem.value);
      break;
    case "Escape":
      if (!open.value) {
        return;
      }

      event.preventDefault();
      await closeDropdown(true, true);
      break;
    case "Tab":
      await closeDropdown(true);
      break;
    default:
      break;
  }
}

function focus() {
  inputRef.value?.focus();
}

async function blur() {
  inputRef.value?.blur();
  await closeDropdown(true);
}

watch(
  () => props.modelValue,
  (value) => {
    inputValue.value = value;
  }
);

watch(filteredOptions, async () => {
  if (!open.value) {
    return;
  }

  syncActiveIndex();
  await nextTick();
  await updatePosition();
});

useDismissibleLayer({
  enabled: open,
  refs: [triggerRef, dropdownRef],
  closeOnEscape: true,
  closeOnOutside: true,
  isTopMost: () => isTopMost.value,
  onDismiss: async (reason) => {
    await closeDropdown(reason === "outside", reason === "escape");
  }
});

defineExpose({
  focus,
  blur,
  open: openDropdown,
  close: closeDropdown
});
</script>

<template>
  <div
    :class="[
      ns.base.value,
      `${ns.base.value}--${mergedSize}`,
      open ? 'is-open' : '',
      mergedDisabled ? 'is-disabled' : '',
      formItem?.validateState.value === 'error' ? 'is-error' : ''
    ]"
    @keydown="handleKeydown"
  >
    <div ref="triggerRef" class="xy-auto-complete__trigger">
      <xy-input
        :id="formItem?.inputId"
        ref="inputRef"
        :model-value="inputValue"
        :placeholder="props.placeholder"
        :disabled="mergedDisabled"
        :clearable="props.clearable"
        :size="mergedSize"
        :prefix-icon="props.prefixIcon"
        :suffix-icon="props.suffixIcon"
        :validate-event="false"
        :aria-label="props.placeholder"
        @update:model-value="emitInputValue(String($event ?? ''))"
        @focus="handleFocus"
        @clear="clearValue"
      >
        <template v-if="$slots.prefix" #prefix>
          <slot name="prefix" />
        </template>
        <template v-if="$slots.suffix" #suffix>
          <slot name="suffix" />
        </template>
      </xy-input>
    </div>

    <teleport :to="props.appendTo" :disabled="!props.teleported">
      <transition name="xy-fade">
        <div
          v-if="open"
          :id="listboxId"
          ref="dropdownRef"
          :class="['xy-auto-complete__dropdown', props.popperClass]"
          :style="dropdownStyle"
          role="listbox"
          :aria-label="props.placeholder"
          :data-placement="actualPlacement"
        >
          <span ref="dropdownArrowRef" class="xy-popper__arrow" :style="arrowStyle" />

          <div v-if="props.loading" class="xy-auto-complete__loading">
            <slot name="loading">
              <XyLoadingIndicator
                class="xy-auto-complete__loading-indicator"
                :spinner="resolvedLoading.spinner"
                :svg="resolvedLoading.svg"
                :svg-view-box="resolvedLoading.svgViewBox"
                :background="resolvedLoading.background"
              />
              <span class="xy-auto-complete__loading-text">{{ resolvedLoading.text }}</span>
            </slot>
          </div>

          <ul v-else-if="filteredOptions.length" class="xy-auto-complete__list">
            <li v-for="(option, index) in filteredOptions" :key="`${option.value}-${index}`">
              <button
                :id="`${listboxId}-${index}`"
                type="button"
                class="xy-auto-complete__option"
                :class="[
                  navigation.activeIndex.value === index ? 'is-active' : '',
                  option.disabled ? 'is-disabled' : ''
                ]"
                :disabled="option.disabled"
                @click="selectOption(option)"
              >
                <slot name="option" :option="option" :active="navigation.activeIndex.value === index">
                  {{ option.label }}
                </slot>
              </button>
            </li>
          </ul>

          <div v-else class="xy-auto-complete__empty">
            <slot name="empty">{{ emptyText }}</slot>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>
