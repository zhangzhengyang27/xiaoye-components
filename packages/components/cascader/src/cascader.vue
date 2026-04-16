<script setup lang="ts">
import { computed, inject, nextTick, ref, watch } from "vue";
import type { StyleValue } from "vue";
import {
  useConfig,
  useDismissibleLayer,
  useFloatingPanel,
  useNamespace,
  useOverlayStack
} from "@xiaoye/composables";
import XyIcon from "../../icon";
import XyInput from "../../input";
import { formItemKey } from "../../form/src/context";
import type {
  CascaderFieldNames,
  CascaderKey,
  CascaderOptionData,
  CascaderProps,
  CascaderValue
} from "./cascader";

interface SearchResult {
  option: CascaderOptionData;
  values: CascaderKey[];
  labels: string[];
}

const props = withDefaults(defineProps<CascaderProps>(), {
  modelValue: null,
  options: () => [],
  props: (): CascaderFieldNames => ({
    label: "label",
    value: "value",
    children: "children",
    disabled: "disabled",
    leaf: "leaf"
  }),
  placeholder: "请选择",
  disabled: false,
  clearable: false,
  filterable: false,
  lazy: false,
  load: undefined,
  size: undefined,
  searchPlaceholder: "搜索选项",
  teleported: true,
  appendTo: "body",
  placement: "bottom-start",
  offset: 8,
  popperClass: "",
  popperStyle: ""
});

const emit = defineEmits<{
  "update:modelValue": [value: CascaderValue];
  change: [value: CascaderValue];
  clear: [];
  visibleChange: [value: boolean];
  focus: [];
  blur: [];
  searchChange: [value: string];
}>();

const formItem = inject(formItemKey, null);
const ns = useNamespace("cascader");
const { size: globalSize } = useConfig();
const mergedSize = computed(() => props.size ?? globalSize.value);
const mergedDisabled = computed(() => props.disabled || Boolean(formItem?.disabled.value));
const triggerRef = ref<HTMLElement | null>(null);
const dropdownRef = ref<HTMLElement | null>(null);
const dropdownArrowRef = ref<HTMLElement | null>(null);
const open = ref(false);
const searchValue = ref("");
const selectedValue = ref<CascaderValue>(props.modelValue);
const columns = ref<CascaderOptionData[][]>([props.options]);
const loadingKey = ref<CascaderKey | null>(null);
const lazyVersion = ref(0);
const { zIndex, isTopMost, openLayer, closeLayer } = useOverlayStack();

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

function fieldName(name: keyof CascaderFieldNames, fallback: string) {
  return props.props[name] ?? fallback;
}

function getLabel(option: CascaderOptionData) {
  return `${option?.[fieldName("label", "label")] ?? ""}`;
}

function getValue(option: CascaderOptionData) {
  return option?.[fieldName("value", "value")] as CascaderKey;
}

function getChildren(option: CascaderOptionData) {
  const childrenKey = fieldName("children", "children");
  const value = option?.[childrenKey];
  return Array.isArray(value) ? (value as CascaderOptionData[]) : [];
}

function setChildren(option: CascaderOptionData, children: CascaderOptionData[]) {
  option[fieldName("children", "children")] = children;
  lazyVersion.value += 1;
}

function isDisabled(option: CascaderOptionData) {
  return Boolean(option?.[fieldName("disabled", "disabled")]);
}

function isLeaf(option: CascaderOptionData) {
  const leafKey = fieldName("leaf", "leaf");
  if (leafKey in option) {
    return Boolean(option?.[leafKey]);
  }

  return getChildren(option).length === 0;
}

function findPath(values: CascaderKey[] | null, options = props.options): CascaderOptionData[] {
  if (!values?.length) {
    return [];
  }

  const path: CascaderOptionData[] = [];
  let currentOptions = options;

  for (const value of values) {
    const matched = currentOptions.find((option) => getValue(option) === value);
    if (!matched) {
      break;
    }

    path.push(matched);
    currentOptions = getChildren(matched);
  }

  return path;
}

function buildColumns(values: CascaderKey[] | null) {
  const nextColumns: CascaderOptionData[][] = [props.options];
  const path = findPath(values);

  path.forEach((option) => {
    const children = getChildren(option);
    if (children.length) {
      nextColumns.push(children);
    }
  });

  columns.value = nextColumns;
}

const selectedPath = computed(() => {
  const version = lazyVersion.value;
  void version;
  return findPath(selectedValue.value);
});

const displayLabel = computed(() => {
  if (!selectedPath.value.length) {
    return props.placeholder;
  }

  return selectedPath.value.map((item) => getLabel(item)).join(" / ");
});

const showClear = computed(() => props.clearable && selectedPath.value.length > 0 && !mergedDisabled.value);

const dropdownStyle = computed<StyleValue>(() => [floatingStyle.value, props.popperStyle]);

function flattenOptions(
  options: CascaderOptionData[],
  parentValues: CascaderKey[] = [],
  parentLabels: string[] = []
): SearchResult[] {
  return options.flatMap((option) => {
    const currentValues = parentValues.concat(getValue(option));
    const currentLabels = parentLabels.concat(getLabel(option));
    const current: SearchResult = {
      option,
      values: currentValues,
      labels: currentLabels
    };

    const children = getChildren(option);

    return [current, ...flattenOptions(children, currentValues, currentLabels)];
  });
}

const searchResults = computed(() => {
  const keyword = searchValue.value.trim().toLowerCase();

  if (!props.filterable || !keyword) {
    return [];
  }

  return flattenOptions(props.options).filter((item) =>
    item.labels.join(" / ").toLowerCase().includes(keyword)
  );
});

async function ensureLoaded(option: CascaderOptionData) {
  if (!props.lazy || !props.load || isLeaf(option) || getChildren(option).length) {
    return;
  }

  loadingKey.value = getValue(option);

  await new Promise<void>((resolve) => {
    props.load?.(option, (children) => {
      setChildren(option, children);
      resolve();
    });
  });

  loadingKey.value = null;
}

async function openDropdown() {
  if (mergedDisabled.value || open.value) {
    return;
  }

  open.value = true;
  emit("visibleChange", true);
  emit("focus");
  openLayer();
  buildColumns(selectedValue.value);

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

  if (restoreFocus) {
    await nextTick();
    triggerRef.value?.focus();
  }

  if (shouldValidate) {
    await formItem?.validate("blur");
  }
}

async function selectResult(result: SearchResult) {
  selectedValue.value = result.values;
  emit("update:modelValue", result.values);
  emit("change", result.values);
  await closeDropdown(false, true);
  await formItem?.validate("change");
}

async function handleOptionClick(option: CascaderOptionData, depth: number) {
  if (isDisabled(option)) {
    return;
  }

  const prefixValues = (selectedValue.value ?? []).slice(0, depth);
  const nextValues = prefixValues.concat(getValue(option));

  await ensureLoaded(option);

  const children = getChildren(option);

  if (children.length && !isLeaf(option)) {
    selectedValue.value = nextValues;
    buildColumns(nextValues);
    await nextTick();
    await updatePosition();
    return;
  }

  selectedValue.value = nextValues;
  emit("update:modelValue", nextValues);
  emit("change", nextValues);
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

function updateSearchValue(value: string) {
  searchValue.value = value;
  emit("searchChange", value);
}

async function handleTriggerKeydown(event: KeyboardEvent) {
  if (mergedDisabled.value) {
    return;
  }

  switch (event.key) {
    case "ArrowDown":
    case "Enter":
    case " ":
      event.preventDefault();
      await openDropdown();
      break;
    case "Escape":
      event.preventDefault();
      await closeDropdown(true, true);
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
    buildColumns(value);
  },
  {
    immediate: true
  }
);

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
    :class="[ns.base.value, `${ns.base.value}--${mergedSize}`, open ? 'is-open' : '', mergedDisabled ? 'is-disabled' : '']"
  >
    <div
      ref="triggerRef"
      class="xy-cascader__trigger"
      role="combobox"
      tabindex="0"
      :aria-disabled="mergedDisabled"
      :aria-expanded="open"
      @click="openDropdown"
      @keydown="handleTriggerKeydown"
    >
      <span :class="['xy-cascader__label', !selectedPath.length ? 'is-placeholder' : '']">
        {{ displayLabel }}
      </span>
      <span class="xy-cascader__actions" :class="{ 'has-clear': showClear }">
        <button v-if="showClear" type="button" class="xy-cascader__clear" @click="clearValue">
          <XyIcon icon="mdi:close-circle" />
        </button>
        <span class="xy-cascader__suffix">
          <XyIcon icon="mdi:chevron-down" />
        </span>
      </span>
    </div>

    <teleport :to="props.appendTo" :disabled="!props.teleported">
      <transition name="xy-fade">
        <div
          v-if="open"
          ref="dropdownRef"
          :class="['xy-cascader__dropdown', props.popperClass]"
          :style="dropdownStyle"
          :data-placement="actualPlacement"
        >
          <span ref="dropdownArrowRef" class="xy-popper__arrow" :style="arrowStyle" />

          <div v-if="props.filterable" class="xy-cascader__search">
            <xy-input
              :model-value="searchValue"
              size="sm"
              clearable
              :placeholder="props.searchPlaceholder"
              :validate-event="false"
              @update:model-value="updateSearchValue(String($event ?? ''))"
            />
          </div>

          <div v-if="searchResults.length" class="xy-cascader__search-results">
            <button
              v-for="result in searchResults"
              :key="result.values.join('-')"
              type="button"
              class="xy-cascader__search-item"
              :disabled="isDisabled(result.option)"
              @click="selectResult(result)"
            >
              {{ result.labels.join(' / ') }}
            </button>
          </div>

          <div v-else class="xy-cascader__columns">
            <ul v-for="(column, depth) in columns" :key="depth" class="xy-cascader__column">
              <li v-for="option in column" :key="String(getValue(option))">
                <button
                  type="button"
                  class="xy-cascader__option"
                  :class="[
                    selectedValue?.[depth] === getValue(option) ? 'is-active' : '',
                    isDisabled(option) ? 'is-disabled' : ''
                  ]"
                  :disabled="isDisabled(option)"
                  @click="handleOptionClick(option, depth)"
                >
                  <span class="xy-cascader__option-label">{{ getLabel(option) }}</span>
                  <XyIcon
                    v-if="loadingKey === getValue(option)"
                    icon="mdi:loading"
                    spin
                    class="xy-cascader__option-loading"
                  />
                  <XyIcon
                    v-else-if="getChildren(option).length || (props.lazy && !isLeaf(option))"
                    icon="mdi:chevron-right"
                    class="xy-cascader__option-arrow"
                  />
                </button>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>
