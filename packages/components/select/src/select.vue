<script setup lang="ts" generic="T extends string | number">
import { computed, getCurrentInstance, inject, nextTick, ref, watch } from "vue";
import type { StyleValue } from "vue";
import {
  useConfig,
  useDismissibleLayer,
  useFloatingPanel,
  useListNavigation,
  useNamespace,
  useOverlayStack
} from "@xiaoye/composables";
import XyIcon from "../../icon";
import { formItemKey } from "../../form/src/context";
import { XyLoadingIndicator, resolveLoadingVisualConfig } from "../../loading/src/shared";
import { DEFAULT_CLEAR_ICON, DEFAULT_SUFFIX_ICON } from "./select";
import type { FlatSelectOption, SelectOptionGroup, SelectOptionItem, SelectProps } from "./select";

interface SelectRenderGroup<T> {
  label?: string;
  isGroup: boolean;
  options: FlatSelectOption<T>[];
}

const props = withDefaults(defineProps<SelectProps<T>>(), {
  modelValue: null,
  placeholder: "请选择",
  disabled: false,
  clearable: false,
  searchable: false,
  size: undefined,
  noDataText: "暂无选项",
  noMatchText: "没有匹配项",
  loading: false,
  loadingText: "加载中",
  searchPlaceholder: "搜索选项",
  prefixIcon: "",
  suffixIcon: DEFAULT_SUFFIX_ICON,
  clearIcon: DEFAULT_CLEAR_ICON,
  teleported: true,
  appendTo: "body",
  placement: "bottom-start",
  offset: 12,
  popperClass: "",
  popperStyle: "",
  fitTriggerWidth: true,
  fitInputWidth: undefined,
  dropdownMinWidth: undefined,
  dropdownMaxWidth: undefined
});

const emit = defineEmits<{
  "update:modelValue": [value: T | null];
  change: [value: T | null];
  clear: [];
  visibleChange: [value: boolean];
  focus: [];
  blur: [];
}>();

const instance = getCurrentInstance();
const formItem = inject(formItemKey, null);
const ns = useNamespace("select");
const { size: globalSize, loading: globalLoading } = useConfig();
const mergedSize = computed(() => props.size ?? globalSize.value);
const triggerRef = ref<HTMLElement | null>(null);
const dropdownRef = ref<HTMLElement | null>(null);
const dropdownArrowRef = ref<HTMLElement | null>(null);
const searchInputRef = ref<HTMLInputElement | null>(null);
const open = ref(false);
const searchValue = ref("");
const listboxId = `xy-select-listbox-${Math.random().toString(36).slice(2, 10)}`;
const selectedValue = ref<T | null>(props.modelValue);
const { zIndex, isTopMost, openLayer, closeLayer } = useOverlayStack();
const resolvedFitInputWidth = computed(() => props.fitInputWidth ?? props.fitTriggerWidth);
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

function isOptionGroup(option: SelectOptionItem<T>): option is SelectOptionGroup<T> {
  return Array.isArray((option as SelectOptionGroup<T>).options);
}

const allOptions = computed(() => {
  const flattened: Array<Omit<FlatSelectOption<T>, "flatIndex">> = [];

  props.options.forEach((item) => {
    if (isOptionGroup(item)) {
      item.options.forEach((option) => {
        flattened.push({
          ...option,
          disabled: Boolean(item.disabled) || Boolean(option.disabled),
          groupLabel: item.label
        });
      });
      return;
    }

    flattened.push(item);
  });

  return flattened;
});

const groupedOptions = computed<SelectRenderGroup<T>[]>(() => {
  const keyword = searchValue.value.trim().toLowerCase();
  const shouldFilter = props.searchable && keyword.length > 0;
  let runningIndex = 0;
  const groups: SelectRenderGroup<T>[] = [];

  props.options.forEach((item) => {
    if (isOptionGroup(item)) {
      const options = item.options
        .filter((option) => (shouldFilter ? option.label.toLowerCase().includes(keyword) : true))
        .map((option) => ({
          ...option,
          disabled: Boolean(item.disabled) || Boolean(option.disabled),
          groupLabel: item.label,
          flatIndex: runningIndex++
        }));

      if (options.length) {
        groups.push({
          label: item.label,
          isGroup: true,
          options
        });
      }

      return;
    }

    if (shouldFilter && !item.label.toLowerCase().includes(keyword)) {
      return;
    }

    groups.push({
      isGroup: false,
      options: [
        {
          ...item,
          flatIndex: runningIndex++
        }
      ]
    });
  });

  return groups;
});

const filteredOptions = computed(() => groupedOptions.value.flatMap((group) => group.options));

const emptyText = computed(() => {
  if (props.loading) {
    return props.loadingText;
  }

  return props.searchable && searchValue.value.trim() ? props.noMatchText : props.noDataText;
});

const selectedOption = computed(
  () => allOptions.value.find((item) => item.value === selectedValue.value) ?? null
);

const displayLabel = computed(() => selectedOption.value?.label ?? props.placeholder);

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
  matchTriggerWidth: resolvedFitInputWidth,
  zIndex
});

const activeOption = computed(() => navigation.activeItem.value);

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
  const selectedIndex = filteredOptions.value.findIndex(
    (item) => item.value === selectedValue.value
  );

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

async function selectOption(option: FlatSelectOption<T>) {
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

function focus() {
  triggerRef.value?.focus();
}

async function blur() {
  triggerRef.value?.blur();
  await closeDropdown(true);
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
      props.disabled ? 'is-disabled' : '',
      formItem?.validateState.value === 'error' ? 'is-error' : ''
    ]"
    :aria-busy="props.loading ? 'true' : undefined"
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
      <span v-if="$slots.prefix || props.prefixIcon" class="xy-select__prefix">
        <slot name="prefix" />
        <XyIcon
          v-if="props.prefixIcon"
          class="xy-select__icon"
          :icon="props.prefixIcon"
          :size="16"
        />
      </span>

      <span class="xy-select__selection" :class="selectedOption ? 'is-selected' : 'is-placeholder'">
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
          <XyIcon :icon="props.clearIcon" :size="16" />
        </button>
        <span class="xy-select__caret">
          <slot name="suffix">
            <XyIcon class="xy-select__icon" :icon="props.suffixIcon" :size="16" />
          </slot>
        </span>
      </span>
    </div>

    <teleport :to="props.appendTo" :disabled="!props.teleported">
      <transition name="xy-fade">
        <div
          v-if="open"
          :id="listboxId"
          ref="dropdownRef"
          :class="['xy-select__dropdown', props.popperClass]"
          :style="dropdownStyle"
          :data-placement="actualPlacement"
          role="listbox"
        >
          <span ref="dropdownArrowRef" class="xy-popper__arrow" :style="arrowStyle" />
          <div v-if="$slots.header" class="xy-select__header" @click.stop>
            <slot name="header" />
          </div>

          <div v-if="props.searchable" class="xy-select__search">
            <input
              ref="searchInputRef"
              v-model="searchValue"
              type="text"
              :placeholder="props.searchPlaceholder"
              @keydown="handleKeydown"
            />
          </div>

          <div class="xy-select__content">
            <div
              v-if="props.loading"
              class="xy-select__loading"
              :style="
                resolvedLoading.background ? { background: resolvedLoading.background } : undefined
              "
            >
              <slot name="loading">
                <XyLoadingIndicator
                  :text="resolvedLoading.text"
                  :spinner="resolvedLoading.spinner"
                  :svg="resolvedLoading.svg"
                  :svg-view-box="resolvedLoading.svgViewBox"
                  layout="inline"
                  size="sm"
                />
              </slot>
            </div>

            <template v-else-if="filteredOptions.length">
              <div
                v-for="group in groupedOptions"
                :key="group.label ?? `group-${group.options[0]?.flatIndex ?? 0}`"
                class="xy-select__group"
              >
                <div v-if="group.isGroup" class="xy-select__group-label">
                  {{ group.label }}
                </div>

                <button
                  v-for="option in group.options"
                  :id="`${listboxId}-${option.flatIndex}`"
                  :key="`${option.value}`"
                  type="button"
                  class="xy-select__option"
                  :class="[
                    option.disabled ? 'is-disabled' : '',
                    option.value === selectedValue ? 'is-selected' : '',
                    navigation.activeIndex.value === option.flatIndex ? 'is-active' : ''
                  ]"
                  role="option"
                  :aria-selected="option.value === selectedValue"
                  :disabled="option.disabled"
                  @mouseenter="navigation.setActiveIndex(option.flatIndex)"
                  @click="selectOption(option)"
                >
                  <slot
                    name="option"
                    :option="option"
                    :selected="option.value === selectedValue"
                    :active="navigation.activeIndex.value === option.flatIndex"
                  >
                    <span>{{ option.label }}</span>
                    <small v-if="option.description">{{ option.description }}</small>
                  </slot>
                </button>
              </div>
            </template>

            <div v-else class="xy-select__empty">
              <slot name="empty">
                <span>{{ emptyText }}</span>
              </slot>
            </div>
          </div>

          <div v-if="$slots.footer" class="xy-select__footer" @click.stop>
            <slot name="footer" />
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>
