<script setup lang="ts">
import { computed, inject, nextTick, ref, watch } from "vue";
import type { ComponentSize } from "@xiaoye/utils";
import {
  useConfig,
  useDismissibleLayer,
  useFloatingPanel,
  useNamespace,
  useOverlayStack
} from "@xiaoye/composables";
import XyIcon from "../../icon";
import { formItemKey } from "../../form/src/context";

interface CalendarCell {
  key: string;
  label: number;
  date: Date;
  inCurrentMonth: boolean;
  disabled: boolean;
}

export interface DatePickerProps {
  modelValue?: string | null;
  placeholder?: string;
  disabled?: boolean;
  clearable?: boolean;
  size?: ComponentSize;
  min?: string;
  max?: string;
}

const props = withDefaults(defineProps<DatePickerProps>(), {
  modelValue: null,
  placeholder: "请选择日期",
  disabled: false,
  clearable: false,
  size: undefined,
  min: undefined,
  max: undefined
});

const emit = defineEmits<{
  "update:modelValue": [value: string | null];
  change: [value: string | null];
  clear: [];
  visibleChange: [value: boolean];
  focus: [];
  blur: [];
}>();

const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
const formItem = inject(formItemKey, null);
const ns = useNamespace("date-picker");
const { size: globalSize } = useConfig();
const mergedSize = computed(() => props.size ?? globalSize.value);
const triggerRef = ref<HTMLElement | null>(null);
const panelRef = ref<HTMLElement | null>(null);
const panelArrowRef = ref<HTMLElement | null>(null);
const open = ref(false);
const selectedValue = ref<string | null>(props.modelValue);
const today = new Date();
const currentMonth = ref(startOfMonth(parseDate(props.modelValue) ?? today));
const focusedDate = ref(stripTime(parseDate(props.modelValue) ?? today));
const panelId = `xy-date-panel-${Math.random().toString(36).slice(2, 10)}`;
const { zIndex, isTopMost, openLayer, closeLayer } = useOverlayStack();

const { actualPlacement, arrowStyle, floatingStyle, updatePosition, startAutoUpdate, stopAutoUpdate } = useFloatingPanel(
  triggerRef,
  panelRef,
  {
    arrowRef: panelArrowRef,
    placement: "bottom-start",
    offset: 8,
    zIndex
  }
);

const displayLabel = computed(() => selectedValue.value ?? props.placeholder);
const selectedDate = computed(() => parseDate(selectedValue.value));
const minDate = computed(() => parseDate(props.min));
const maxDate = computed(() => parseDate(props.max));

const calendarCells = computed<CalendarCell[]>(() => {
  const monthStart = startOfMonth(currentMonth.value);
  const gridStart = new Date(monthStart);

  gridStart.setDate(monthStart.getDate() - monthStart.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);

    date.setDate(gridStart.getDate() + index);

    return {
      key: formatDate(date),
      label: date.getDate(),
      date,
      inCurrentMonth: date.getMonth() === monthStart.getMonth(),
      disabled: isDateDisabled(date)
    };
  });
});

function stripTime(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function parseDate(value?: string | null) {
  if (!value) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    return null;
  }

  return new Date(year, month - 1, day);
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatMonthLabel(date: Date) {
  return `${date.getFullYear()} 年 ${date.getMonth() + 1} 月`;
}

function isSameDay(left?: Date | null, right?: Date | null) {
  if (!left || !right) {
    return false;
  }

  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function isDateDisabled(date: Date) {
  const normalized = stripTime(date);

  if (minDate.value && normalized < stripTime(minDate.value)) {
    return true;
  }

  if (maxDate.value && normalized > stripTime(maxDate.value)) {
    return true;
  }

  return false;
}

function syncPanelState() {
  const baseDate = parseDate(selectedValue.value) ?? today;

  currentMonth.value = startOfMonth(baseDate);
  focusedDate.value = stripTime(baseDate);
}

async function openPanel() {
  if (props.disabled || open.value) {
    return;
  }

  open.value = true;
  emit("visibleChange", true);
  emit("focus");
  syncPanelState();
  openLayer();
  await nextTick();
  await updatePosition();
  startAutoUpdate();
  panelRef.value?.focus();
}

async function closePanel(shouldValidate = false, restoreFocus = false) {
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

async function selectDate(date: Date) {
  if (isDateDisabled(date)) {
    return;
  }

  const formatted = formatDate(date);

  selectedValue.value = formatted;
  emit("update:modelValue", formatted);
  emit("change", formatted);
  await closePanel(false, true);
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

function moveMonth(step: number) {
  const next = new Date(currentMonth.value);

  next.setMonth(next.getMonth() + step);
  currentMonth.value = startOfMonth(next);

  if (focusedDate.value.getMonth() !== next.getMonth()) {
    focusedDate.value = startOfMonth(next);
  }
}

function focusByOffset(offset: number) {
  const next = new Date(focusedDate.value);

  next.setDate(next.getDate() + offset);
  focusedDate.value = stripTime(next);

  if (
    focusedDate.value.getFullYear() !== currentMonth.value.getFullYear() ||
    focusedDate.value.getMonth() !== currentMonth.value.getMonth()
  ) {
    currentMonth.value = startOfMonth(focusedDate.value);
  }
}

async function handleTriggerKeydown(event: KeyboardEvent) {
  if (props.disabled) {
    return;
  }

  switch (event.key) {
    case "Enter":
    case " ":
    case "ArrowDown":
      event.preventDefault();
      await openPanel();
      break;
    case "Escape":
      event.preventDefault();
      await closePanel(true, true);
      break;
    default:
      break;
  }
}

async function handlePanelKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case "ArrowLeft":
      event.preventDefault();
      focusByOffset(-1);
      break;
    case "ArrowRight":
      event.preventDefault();
      focusByOffset(1);
      break;
    case "ArrowUp":
      event.preventDefault();
      focusByOffset(-7);
      break;
    case "ArrowDown":
      event.preventDefault();
      focusByOffset(7);
      break;
    case "PageUp":
      event.preventDefault();
      moveMonth(-1);
      break;
    case "PageDown":
      event.preventDefault();
      moveMonth(1);
      break;
    case "Enter":
    case " ":
      event.preventDefault();
      await selectDate(focusedDate.value);
      break;
    case "Escape":
      event.preventDefault();
      await closePanel(true, true);
      break;
    default:
      break;
  }
}

async function selectToday() {
  await selectDate(today);
}

watch(
  () => props.modelValue,
  (value) => {
    selectedValue.value = value;
    if (!open.value) {
      syncPanelState();
    }
  }
);

useDismissibleLayer({
  enabled: open,
  refs: [triggerRef, panelRef],
  closeOnEscape: true,
  closeOnOutside: true,
  isTopMost: () => isTopMost.value,
  onDismiss: async (reason) => {
    await closePanel(reason === "outside", reason === "escape");
  }
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
  >
    <div
      ref="triggerRef"
      class="xy-date-picker__trigger"
      role="combobox"
      :tabindex="props.disabled ? -1 : 0"
      :aria-expanded="open"
      :aria-controls="panelId"
      :aria-describedby="formItem?.message.value ? formItem.messageId : undefined"
      :aria-invalid="formItem?.validateState.value === 'error'"
      @click="openPanel"
      @keydown="handleTriggerKeydown"
    >
      <span class="xy-date-picker__selection" :class="selectedValue ? 'is-value' : 'is-placeholder'">
        {{ displayLabel }}
      </span>
      <span class="xy-date-picker__actions">
        <button
          v-if="props.clearable && selectedValue && !props.disabled"
          type="button"
          class="xy-date-picker__clear"
          aria-label="clear"
          @click="clearValue"
        >
          <XyIcon class="xy-date-picker__icon" icon="mdi:close-circle" :size="16" />
        </button>
        <span class="xy-date-picker__caret">
          <XyIcon class="xy-date-picker__icon" icon="mdi:chevron-down" :size="16" />
        </span>
      </span>
    </div>

    <teleport to="body">
      <transition name="xy-fade">
        <div
          v-if="open"
          :id="panelId"
          ref="panelRef"
          class="xy-date-picker__panel"
          :style="floatingStyle"
          :data-placement="actualPlacement"
          role="dialog"
          tabindex="-1"
          @keydown="handlePanelKeydown"
        >
          <span ref="panelArrowRef" class="xy-popper__arrow" :style="arrowStyle" />
          <header class="xy-date-picker__header">
            <button type="button" @click="moveMonth(-1)">‹</button>
            <strong>{{ formatMonthLabel(currentMonth) }}</strong>
            <button type="button" @click="moveMonth(1)">›</button>
          </header>
          <div class="xy-date-picker__weekdays">
            <span v-for="weekday in weekdays" :key="weekday">{{ weekday }}</span>
          </div>
          <div class="xy-date-picker__grid">
            <button
              v-for="cell in calendarCells"
              :key="cell.key"
              type="button"
              class="xy-date-picker__cell"
              :class="[
                cell.inCurrentMonth ? '' : 'is-outside',
                isSameDay(cell.date, focusedDate) ? 'is-focused' : '',
                isSameDay(cell.date, selectedDate) ? 'is-selected' : '',
                cell.disabled ? 'is-disabled' : '',
                isSameDay(cell.date, today) ? 'is-today' : ''
              ]"
              :disabled="cell.disabled"
              @mouseenter="focusedDate = stripTime(cell.date)"
              @click="selectDate(cell.date)"
            >
              {{ cell.label }}
            </button>
          </div>
          <footer class="xy-date-picker__footer">
            <button type="button" @click="selectToday">今天</button>
            <button type="button" @click="closePanel(true, true)">关闭</button>
          </footer>
        </div>
      </transition>
    </teleport>
  </div>
</template>
