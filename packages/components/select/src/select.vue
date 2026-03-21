<script setup lang="ts" generic="T extends string | number">
import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import type { ComponentSize, SelectOption } from "@xiaoye/utils";
import { bindClickOutside } from "@xiaoye/utils";
import { useConfig, useNamespace } from "@xiaoye/composables";
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
const searchInputRef = ref<HTMLInputElement | null>(null);
const searchValue = ref("");
const open = ref(false);
const activeIndex = ref(-1);
const listboxId = `xy-select-listbox-${Math.random().toString(36).slice(2, 10)}`;
const selectedValue = ref<T | null>(props.modelValue);
let cleanup: (() => void) | null = null;

const selectedOption = computed(() =>
  props.options.find((item) => item.value === selectedValue.value) ?? null
);

const displayLabel = computed(() => selectedOption.value?.label ?? props.placeholder);
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
const activeOption = computed(() => filteredOptions.value[activeIndex.value] ?? null);

function findEnabledIndex(startIndex: number, step: 1 | -1) {
  const options = filteredOptions.value;

  if (!options.length) {
    return -1;
  }

  let index = startIndex;

  while (index >= 0 && index < options.length) {
    if (!options[index]?.disabled) {
      return index;
    }

    index += step;
  }

  return -1;
}

function syncActiveIndex() {
  const selectedIndex = filteredOptions.value.findIndex((item) => item.value === selectedValue.value);

  if (selectedIndex >= 0 && !filteredOptions.value[selectedIndex]?.disabled) {
    activeIndex.value = selectedIndex;
    return;
  }

  activeIndex.value = findEnabledIndex(0, 1);
}

function scrollActiveOptionIntoView() {
  if (!open.value || activeIndex.value < 0) {
    return;
  }

  const activeOptionElement = rootRef.value?.querySelector(
    `[id="${listboxId}-${activeIndex.value}"]`
  );

  if (
    activeOptionElement instanceof HTMLElement &&
    typeof activeOptionElement.scrollIntoView === "function"
  ) {
    activeOptionElement.scrollIntoView({
      block: "nearest"
    });
  }
}

async function openDropdown() {
  if (props.disabled || open.value) {
    return;
  }

  open.value = true;
  emit("visibleChange", true);
  emit("focus");
  syncActiveIndex();

  await nextTick();
  scrollActiveOptionIntoView();

  if (props.searchable) {
    searchInputRef.value?.focus();
  }
}

async function closeDropdown(shouldValidate = false) {
  if (!open.value) {
    return;
  }

  open.value = false;
  emit("visibleChange", false);
  emit("blur");

  if (shouldValidate) {
    await formItem?.validate("blur");
  }
}

async function toggle() {
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
  searchValue.value = "";
  await closeDropdown(false);
  await formItem?.validate("change");
}

async function clearValue(event: MouseEvent) {
  event.stopPropagation();
  event.preventDefault();
  selectedValue.value = null;
  emit("update:modelValue", null);
  emit("change", null);
  emit("clear");
  await formItem?.validate("change");
}

watch(open, (value) => {
  if (!value) {
    searchValue.value = "";
    activeIndex.value = -1;
  }
});

watch(
  () => props.modelValue,
  (value) => {
    selectedValue.value = value;
  }
);

watch(
  () => filteredOptions.value,
  () => {
    if (open.value) {
      syncActiveIndex();
      nextTick(scrollActiveOptionIntoView);
    }
  }
);

watch(
  () => props.modelValue,
  () => {
    if (open.value) {
      syncActiveIndex();
      nextTick(scrollActiveOptionIntoView);
    }
  }
);

async function handleTriggerKeydown(event: KeyboardEvent) {
  if (props.disabled) {
    return;
  }

  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      if (!open.value) {
        await openDropdown();
        return;
      }
      activeIndex.value = findEnabledIndex(activeIndex.value + 1, 1);
      nextTick(scrollActiveOptionIntoView);
      break;
    case "ArrowUp":
      event.preventDefault();
      if (!open.value) {
        await openDropdown();
        return;
      }
      activeIndex.value = findEnabledIndex(activeIndex.value - 1, -1);
      nextTick(scrollActiveOptionIntoView);
      break;
    case "Enter":
    case " ":
      event.preventDefault();
      if (!open.value) {
        await openDropdown();
        return;
      }
      if (activeOption.value) {
        await selectOption(activeOption.value);
      }
      break;
    case "Escape":
      event.preventDefault();
      await closeDropdown(true);
      triggerRef.value?.focus();
      break;
    case "Tab":
      await closeDropdown(true);
      break;
    default:
      break;
  }
}

onMounted(() => {
  if (!rootRef.value) {
    return;
  }

  cleanup = bindClickOutside(rootRef.value, async () => {
    if (!open.value) {
      return;
    }

    await closeDropdown(true);
  });
});

onBeforeUnmount(() => {
  cleanup?.();
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
      :aria-activedescendant="activeOption ? `${listboxId}-${activeIndex}` : undefined"
      :aria-describedby="formItem?.message.value ? formItem.messageId : undefined"
      :aria-invalid="formItem?.validateState.value === 'error'"
      @click="toggle"
      @keydown="handleTriggerKeydown"
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

    <div v-if="open" :id="listboxId" class="xy-select__dropdown" role="listbox">
      <div v-if="props.searchable" class="xy-select__search">
        <input
          ref="searchInputRef"
          v-model="searchValue"
          type="text"
          placeholder="搜索选项"
          @keydown="handleTriggerKeydown"
        />
      </div>
      <button
        v-for="option in filteredOptions"
        :id="`${listboxId}-${filteredOptions.indexOf(option)}`"
        :key="`${option.value}`"
        type="button"
        class="xy-select__option"
        :class="[
          option.disabled ? 'is-disabled' : '',
          option.value === selectedValue ? 'is-selected' : '',
          filteredOptions.indexOf(option) === activeIndex ? 'is-active' : ''
        ]"
        role="option"
        :aria-selected="option.value === selectedValue"
        :disabled="option.disabled"
        @mouseenter="activeIndex = filteredOptions.indexOf(option)"
        @click="selectOption(option)"
      >
        <span>{{ option.label }}</span>
        <small v-if="option.description">{{ option.description }}</small>
      </button>
      <div v-if="!filteredOptions.length" class="xy-select__empty">{{ emptyText }}</div>
    </div>
  </div>
</template>
