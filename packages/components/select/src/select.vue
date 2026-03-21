<script setup lang="ts" generic="T extends string | number">
import { computed, inject, nextTick, ref, watch } from "vue";
import type { ComponentSize, SelectOption } from "@xiaoye/utils";
import {
  useConfig,
  useDismissibleLayer,
  useFloatingPanel,
  useListNavigation,
  useNamespace,
  useOverlayStack
} from "@xiaoye/composables";
import { formItemKey } from "../../form/src/context";

export interface SelectProps<T = string | number> {
  modelValue?: T | null;
  options: SelectOption<T>[];
  placeholder?: string;
  disabled?: boolean;
  clearable?: boolean;
  searchable?: boolean;
  size?: ComponentSize;
  noDataText?: string;
  noMatchText?: string;
}

const props = withDefaults(defineProps<SelectProps<T>>(), {
  modelValue: null,
  placeholder: "请选择",
  disabled: false,
  clearable: false,
  searchable: false,
  size: undefined,
  noDataText: "暂无选项",
  noMatchText: "没有匹配项"
});

const emit = defineEmits<{
  "update:modelValue": [value: T | null];
  change: [value: T | null];
  clear: [];
  visibleChange: [value: boolean];
  focus: [];
  blur: [];
}>();

const formItem = inject(formItemKey, null);
const ns = useNamespace("select");
const { size: globalSize } = useConfig();
const mergedSize = computed(() => props.size ?? globalSize.value);
const rootRef = ref<HTMLElement | null>(null);
const triggerRef = ref<HTMLElement | null>(null);
const dropdownRef = ref<HTMLElement | null>(null);
const searchInputRef = ref<HTMLInputElement | null>(null);
const open = ref(false);
const searchValue = ref("");
const listboxId = `xy-select-listbox-${Math.random().toString(36).slice(2, 10)}`;
const selectedValue = ref<T | null>(props.modelValue);
const { zIndex, isTopMost, openLayer, closeLayer } = useOverlayStack();

const filteredOptions = computed(() => {
  if (!props.searchable || !searchValue.value.trim()) {
    return props.options;
  }

  const keyword = searchValue.value.trim().toLowerCase();
  return props.options.filter((item) => item.label.toLowerCase().includes(keyword));
});

const emptyText = computed(() =>
  props.searchable && searchValue.value.trim() ? props.noMatchText : props.noDataText
);

const selectedOption = computed(
  () => props.options.find((item) => item.value === selectedValue.value) ?? null
);

const displayLabel = computed(() => selectedOption.value?.label ?? props.placeholder);

const navigation = useListNavigation(() => filteredOptions.value, {
  loop: true
});

const { floatingStyle, updatePosition, startAutoUpdate, stopAutoUpdate } = useFloatingPanel(
  triggerRef,
  dropdownRef,
  {
    placement: "bottom-start",
    offset: 8,
    matchTriggerWidth: true,
    zIndex
  }
);

const activeOption = computed(() => navigation.activeItem.value);

function syncActiveIndex() {
  const selectedIndex = filteredOptions.value.findIndex((item) => item.value === selectedValue.value);

  if (selectedIndex >= 0 && !filteredOptions.value[selectedIndex]?.disabled) {
    navigation.setActiveIndex(selectedIndex);
    return;
  }

  navigation.activateFirst();
}

async function focusSearchInput() {
  if (!props.searchable) {
    return;
  }

  await nextTick();
  searchInputRef.value?.focus();
}

async function openDropdown() {
  if (props.disabled || open.value) {
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
  await focusSearchInput();
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
  searchValue.value = "";
  navigation.setActiveIndex(-1);

  if (restoreFocus) {
    await nextTick();
    triggerRef.value?.focus();
  }

  if (shouldValidate) {
    await formItem?.validate("blur");
  }
}

async function toggleDropdown() {
  if (open.value) {
    await closeDropdown(true);
    return;
  }

  await openDropdown();
}

async function selectOption(option: SelectOption<T>) {
  if (option.disabled) {
    return;
  }

  selectedValue.value = option.value;
  emit("update:modelValue", option.value);
  emit("change", option.value);
  await closeDropdown(false, true);
  await formItem?.validate("change");
}

async function clearValue(event: MouseEvent) {
  event.preventDefault();
  event.stopPropagation();

  selectedValue.value = null;
  emit("update:modelValue", null);
  emit("change", null);
  emit("clear");
  await formItem?.validate("change");
}

async function handleKeydown(event: KeyboardEvent) {
  if (props.disabled) {
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
    case "Home":
      event.preventDefault();
      if (!open.value) {
        await openDropdown();
      }
      navigation.activateFirst();
      break;
    case "End":
      event.preventDefault();
      if (!open.value) {
        await openDropdown();
      }
      navigation.activateLast();
      break;
    case "Enter":
    case " ":
      event.preventDefault();
      if (!open.value) {
        await openDropdown();
        break;
      }

      if (activeOption.value) {
        await selectOption(activeOption.value);
      }
      break;
    case "Escape":
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

watch(
  () => props.modelValue,
  (value) => {
    selectedValue.value = value;
  }
);

watch(filteredOptions, () => {
  if (open.value) {
    syncActiveIndex();
  }
});

watch(open, async (value) => {
  if (!value) {
    return;
  }

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
</script>

<template>
  <div
    ref="rootRef"
    :class="[
      ns.base.value,
      `${ns.base.value}--${mergedSize}`,
      open ? 'is-open' : '',
      props.disabled ? 'is-disabled' : '',
      formItem?.validateState.value === 'error' ? 'is-error' : ''
    ]"
  >
    <div
      ref="triggerRef"
      class="xy-select__trigger"
      role="combobox"
      :tabindex="props.disabled ? -1 : 0"
      aria-haspopup="listbox"
      :aria-disabled="props.disabled"
      :aria-expanded="open"
      :aria-controls="listboxId"
      :aria-activedescendant="
        open && navigation.activeIndex.value >= 0
          ? `${listboxId}-${navigation.activeIndex.value}`
          : undefined
      "
      :aria-describedby="formItem?.message.value ? formItem.messageId : undefined"
      :aria-invalid="formItem?.validateState.value === 'error'"
      @click="toggleDropdown"
      @keydown="handleKeydown"
    >
      <span :class="selectedOption ? 'is-selected' : 'is-placeholder'">
        {{ displayLabel }}
      </span>
      <span class="xy-select__actions">
        <button
          v-if="props.clearable && selectedOption && !props.disabled"
          type="button"
          class="xy-select__clear"
          aria-label="clear"
          @click="clearValue"
        >
          ×
        </button>
        <span class="xy-select__caret">⌄</span>
      </span>
    </div>

    <teleport to="body">
      <transition name="xy-fade">
        <div
          v-if="open"
          :id="listboxId"
          ref="dropdownRef"
          class="xy-select__dropdown"
          :style="floatingStyle"
          role="listbox"
        >
          <div v-if="props.searchable" class="xy-select__search">
            <input
              ref="searchInputRef"
              v-model="searchValue"
              type="text"
              placeholder="搜索选项"
              @keydown="handleKeydown"
            />
          </div>
          <button
            v-for="(option, index) in filteredOptions"
            :id="`${listboxId}-${index}`"
            :key="`${option.value}`"
            type="button"
            class="xy-select__option"
            :class="[
              option.disabled ? 'is-disabled' : '',
              option.value === selectedValue ? 'is-selected' : '',
              navigation.activeIndex.value === index ? 'is-active' : ''
            ]"
            role="option"
            :aria-selected="option.value === selectedValue"
            :disabled="option.disabled"
            @mouseenter="navigation.setActiveIndex(index)"
            @click="selectOption(option)"
          >
            <span>{{ option.label }}</span>
            <small v-if="option.description">{{ option.description }}</small>
          </button>
          <div v-if="!filteredOptions.length" class="xy-select__empty">{{ emptyText }}</div>
        </div>
      </transition>
    </teleport>
  </div>
</template>
