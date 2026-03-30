<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import type { Placement, ReferenceElement } from "@floating-ui/dom";
import { useDismissibleLayer, useFloatingPanel, useOverlayStack } from "@xiaoye/composables";
import XyCheckbox from "../../checkbox";
import type { TableFilterOption, TableFilterValue } from "./table";

defineOptions({
  name: "XyTableFilterPanel"
});

const props = withDefaults(
  defineProps<{
    title?: string;
    options?: TableFilterOption[];
    selectedValues?: TableFilterValue[];
    multiple?: boolean;
    open?: boolean;
    placement?: Placement;
    appendTo?: string;
    panelClass?: string;
    referenceEl?: HTMLElement | null;
  }>(),
  {
    title: "",
    options: () => [],
    selectedValues: () => [],
    multiple: true,
    open: false,
    placement: "bottom-start",
    appendTo: "",
    panelClass: "",
    referenceEl: null
  }
);

const emit = defineEmits<{
  select: [values: TableFilterValue[]];
  close: [];
}>();

const panelRef = ref<HTMLElement | null>(null);
const rootRef = ref<HTMLElement | null>(null);
const draftSelectedValues = ref<TableFilterValue[]>([]);
const checkedIndex = ref(0);
const referenceRef = computed<ReferenceElement | null>(() => props.referenceEl);
const teleportTarget = computed(() => props.appendTo || "body");
const shouldTeleport = computed(() => {
  if (!props.appendTo || typeof document === "undefined") {
    return false;
  }

  if (props.appendTo === "body") {
    return true;
  }

  return Boolean(document.querySelector(props.appendTo));
});
const { zIndex, isTopMost, openLayer, closeLayer } = useOverlayStack();
const { floatingStyle, updatePosition, startAutoUpdate, stopAutoUpdate } = useFloatingPanel(
  referenceRef,
  panelRef,
  {
    placement: () => props.placement,
    strategy: "fixed",
    offset: 8,
    shiftPadding: 12,
    zIndex
  }
);

useDismissibleLayer({
  enabled: () => props.open,
  refs: [() => props.referenceEl, panelRef],
  closeOnEscape: true,
  closeOnOutside: true,
  isTopMost: () => isTopMost.value,
  onDismiss: () => {
    emit("close");
  }
});

watch(
  () => [props.open, props.referenceEl, props.placement, props.appendTo],
  async ([open]) => {
    stopAutoUpdate();

    if (!open) {
      closeLayer();
      return;
    }

    openLayer();
    await nextTick();
    await updatePosition();
    startAutoUpdate();
    rootRef.value?.focus();

    if (!props.multiple) {
      initCheckedIndex();
      await nextTick();
      focusSingleSelectItem(checkedIndex.value);
    }
  },
  {
    immediate: true
  }
);

watch(
  () => [props.open, props.selectedValues] as const,
  () => {
    draftSelectedValues.value = [...props.selectedValues];
  },
  {
    immediate: true,
    deep: true
  }
);

onBeforeUnmount(() => {
  stopAutoUpdate();
  closeLayer();
});

const hasDraftSelection = computed(() => draftSelectedValues.value.length > 0);

function isSelected(value: TableFilterValue) {
  const selectedValues = props.multiple ? draftSelectedValues.value : props.selectedValues;

  return selectedValues.some((item) => Object.is(item, value));
}

function focusSingleSelectItem(index: number) {
  rootRef.value
    ?.querySelector<HTMLElement>(`.xy-table__filter-option:nth-child(${index + 1})`)
    ?.focus();
}

function initCheckedIndex() {
  const selectedValue = props.selectedValues[0];

  if (selectedValue === undefined) {
    checkedIndex.value = 0;
    return;
  }

  const targetIndex = props.options.findIndex((option) => Object.is(option.value, selectedValue));
  checkedIndex.value = targetIndex >= 0 ? targetIndex + 1 : 0;
}

function handleOptionSelect(value?: TableFilterValue) {
  emit("select", value === undefined ? [] : [value]);
  emit("close");
}

function handleMultipleOptionToggle(value: TableFilterValue) {
  const nextValues = isSelected(value)
    ? draftSelectedValues.value.filter((item) => !Object.is(item, value))
    : [...draftSelectedValues.value, value];

  draftSelectedValues.value = nextValues;
}

function handleConfirm() {
  emit("select", [...draftSelectedValues.value]);
  emit("close");
}

function handleReset() {
  draftSelectedValues.value = [];
  emit("select", []);
  emit("close");
}

function handleKeydown(event: KeyboardEvent) {
  if (props.multiple) {
    return;
  }

  const length = props.options.length + 1;
  let nextIndex = checkedIndex.value;
  let shouldPreventDefault = true;

  switch (event.key) {
    case "ArrowDown":
    case "ArrowRight":
      nextIndex = (nextIndex + 1) % length;
      break;
    case "ArrowUp":
    case "ArrowLeft":
      nextIndex = (nextIndex - 1 + length) % length;
      break;
    case "Tab":
      emit("close");
      shouldPreventDefault = false;
      break;
    case "Enter":
    case " ":
      if (nextIndex === 0) {
        handleReset();
      } else {
        const option = props.options[nextIndex - 1];
        if (option) {
          handleOptionSelect(option.value);
        }
      }
      break;
    default:
      shouldPreventDefault = false;
      break;
  }

  if (shouldPreventDefault) {
    event.preventDefault();
  }

  checkedIndex.value = nextIndex;
  focusSingleSelectItem(nextIndex);
}
</script>

<template>
  <teleport :to="teleportTarget" :disabled="!shouldTeleport">
    <section
      v-if="props.open"
      ref="panelRef"
      :class="['xy-table__filter-panel', props.panelClass]"
      :style="floatingStyle"
      role="dialog"
      aria-modal="false"
      @click.stop
    >
      <template v-if="props.multiple">
        <div ref="rootRef" class="xy-table__filter-panel-content" tabindex="-1">
          <div class="xy-table__filter-checkbox-group">
            <label
              v-for="option in props.options"
              :key="`${option.text}-${option.value}`"
              class="xy-table__filter-option xy-table__filter-checkbox"
              @click.prevent="handleMultipleOptionToggle(option.value)"
            >
              <xy-checkbox :model-value="isSelected(option.value)" />
              <span class="xy-table__filter-checkbox-label">{{ option.text }}</span>
            </label>
          </div>
        </div>

        <div class="xy-table__filter-panel-footer">
          <button
            class="xy-table__filter-panel-action"
            :class="{ 'is-disabled': !hasDraftSelection }"
            type="button"
            :disabled="!hasDraftSelection"
            @click="handleConfirm"
          >
            确定
          </button>
          <button class="xy-table__filter-panel-action" type="button" @click="handleReset">重置</button>
        </div>
      </template>

      <ul
        v-else
        ref="rootRef"
        class="xy-table__filter-panel-list"
        role="radiogroup"
        tabindex="-1"
        aria-label="筛选选项"
        @keydown="handleKeydown"
      >
        <li
          role="radio"
          class="xy-table__filter-option"
          :class="{ 'is-selected': props.selectedValues.length === 0 }"
          :tabindex="checkedIndex === 0 ? 0 : -1"
          :aria-checked="props.selectedValues.length === 0"
          @click="handleOptionSelect()"
        >
          清除筛选
        </li>
        <li
          v-for="option in props.options"
          :key="`${option.text}-${option.value}`"
          role="radio"
          class="xy-table__filter-option"
          :class="{ 'is-selected': isSelected(option.value) }"
          :tabindex="checkedIndex === props.options.findIndex((item) => Object.is(item.value, option.value)) + 1 ? 0 : -1"
          :aria-checked="isSelected(option.value)"
          @click="handleOptionSelect(option.value)"
        >
          {{ option.text }}
        </li>
      </ul>
    </section>
  </teleport>
</template>
