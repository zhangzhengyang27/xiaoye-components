<script setup lang="ts">
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { computed, inject, nextTick, ref, watch } from "vue";
import {
  useConfig,
  useDismissibleLayer,
  useFloatingPanel,
  useNamespace,
  useOverlayStack
} from "@xiaoye/composables";
import XyIcon from "../../icon";
import { formItemKey } from "../../form/src/context";
import type {
  DatePickerProps,
  DatePickerShortcut,
  DatePickerType,
  DatePickerValue
} from "./date-picker";

interface CalendarCell {
  key: string;
  label: number;
  date: Date;
  inCurrentMonth: boolean;
  disabled: boolean;
}

dayjs.extend(customParseFormat);

const props = withDefaults(defineProps<DatePickerProps>(), {
  modelValue: null,
  type: "date",
  placeholder: "请选择日期",
  disabled: false,
  clearable: false,
  size: undefined,
  min: undefined,
  max: undefined,
  format: undefined,
  valueFormat: undefined,
  shortcuts: () => [],
  disabledDate: undefined
});

const emit = defineEmits<{
  "update:modelValue": [value: DatePickerValue];
  change: [value: DatePickerValue];
  clear: [];
  visibleChange: [value: boolean];
  focus: [];
  blur: [];
}>();

const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
const monthLabels = Array.from({ length: 12 }, (_, index) => `${index + 1} 月`);
const formItem = inject(formItemKey, null);
const ns = useNamespace("date-picker");
const { size: globalSize } = useConfig();
const mergedSize = computed(() => props.size ?? globalSize.value);
const mergedDisabled = computed(() => props.disabled || Boolean(formItem?.disabled.value));
const triggerRef = ref<HTMLElement | null>(null);
const panelRef = ref<HTMLElement | null>(null);
const panelArrowRef = ref<HTMLElement | null>(null);
const open = ref(false);
const selectedValue = ref<DatePickerValue>(props.modelValue);
const draftRange = ref<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);
const today = dayjs().startOf("day");
const panelId = `xy-date-panel-${Math.random().toString(36).slice(2, 10)}`;
const { zIndex, isTopMost, openLayer, closeLayer } = useOverlayStack();

const {
  actualPlacement,
  arrowStyle,
  floatingStyle,
  updatePosition,
  startAutoUpdate,
  stopAutoUpdate
} = useFloatingPanel(triggerRef, panelRef, {
  arrowRef: panelArrowRef,
  placement: "bottom-start",
  offset: 8,
  zIndex
});

const rangeMode = computed(() => props.type === "daterange");
const displayFormat = computed(() => props.format ?? getDefaultFormat(props.type));
const modelFormat = computed(() => props.valueFormat ?? getDefaultFormat(props.type));
const selectedDates = computed(() => normalizeModelValue(selectedValue.value, props.type, modelFormat.value));
const currentPanelDate = ref(resolveAnchorDate(props.modelValue, props.type, modelFormat.value));
const focusedDate = ref(resolveAnchorDate(props.modelValue, props.type, modelFormat.value));
const minDate = computed(() => parseByFormat(props.min, modelFormat.value));
const maxDate = computed(() => parseByFormat(props.max, modelFormat.value));
const yearPanelStart = computed(() => Math.floor(currentPanelDate.value.year() / 12) * 12);

const displayLabel = computed(() => {
  if (rangeMode.value) {
    const [start, end] = selectedDates.value;

    if (start && end) {
      return `${formatByPattern(start, displayFormat.value)} 至 ${formatByPattern(end, displayFormat.value)}`;
    }

    return props.placeholder;
  }

  const [first] = selectedDates.value;
  return first ? formatByPattern(first, displayFormat.value) : props.placeholder;
});

const hasDisplayValue = computed(() => {
  const [start, end] = selectedDates.value;
  return rangeMode.value ? Boolean(start && end) : Boolean(start);
});

const calendarCells = computed<CalendarCell[]>(() => {
  const monthStart = currentPanelDate.value.startOf("month");
  const gridStart = monthStart.startOf("week");

  return Array.from({ length: 42 }, (_, index) => {
    const date = gridStart.add(index, "day");
    return {
      key: date.format("YYYY-MM-DD"),
      label: date.date(),
      date: date.toDate(),
      inCurrentMonth: date.month() === monthStart.month(),
      disabled: isDateDisabled(date)
    };
  });
});

const monthCells = computed(() =>
  monthLabels.map((label, index) => {
    const value = currentPanelDate.value.month(index).startOf("month");
    return {
      key: value.format("YYYY-MM"),
      label,
      value,
      disabled: isDateDisabled(value)
    };
  })
);

const yearCells = computed(() =>
  Array.from({ length: 12 }, (_, index) => {
    const value = currentPanelDate.value.year(yearPanelStart.value + index).startOf("year");
    return {
      key: `${value.year()}`,
      label: `${value.year()} 年`,
      value,
      disabled: isDateDisabled(value)
    };
  })
);

function getDefaultFormat(type: DatePickerType) {
  switch (type) {
    case "month":
      return "YYYY-MM";
    case "year":
      return "YYYY";
    case "week":
      return "YYYY-[W]WW";
    default:
      return "YYYY-MM-DD";
  }
}

function parseByFormat(value: string | null | undefined, format: string) {
  if (!value) {
    return null;
  }

  if (format === "YYYY-[W]WW") {
    const match = value.match(/^(\d{4})-W(\d{2})$/);

    if (!match) {
      return null;
    }

    const year = Number(match[1]);
    const week = Number(match[2]);
    const first = dayjs(`${year}-01-01`).startOf("year");
    return first.add(week - 1, "week").startOf("week");
  }

  const parsed = dayjs(value, format, true);
  return parsed.isValid() ? parsed.startOf("day") : null;
}

function formatByPattern(value: dayjs.Dayjs, format: string) {
  if (format === "YYYY-[W]WW") {
    const start = dayjs(`${value.year()}-01-01`).startOf("week");
    const week = `${value.startOf("week").diff(start, "week") + 1}`.padStart(2, "0");
    return `${value.format("YYYY")}-W${week}`;
  }

  return value.format(format);
}

function normalizeModelValue(value: DatePickerValue, type: DatePickerType, format: string) {
  if (type === "daterange") {
    if (!Array.isArray(value)) {
      return [null, null] as [dayjs.Dayjs | null, dayjs.Dayjs | null];
    }

    return [parseByFormat(value[0], format), parseByFormat(value[1], format)] as [
      dayjs.Dayjs | null,
      dayjs.Dayjs | null
    ];
  }

  if (Array.isArray(value)) {
    return [null, null] as [dayjs.Dayjs | null, dayjs.Dayjs | null];
  }

  return [parseByFormat(value, format), null] as [dayjs.Dayjs | null, dayjs.Dayjs | null];
}

function resolveAnchorDate(value: DatePickerValue, type: DatePickerType, format: string) {
  const normalized = Array.isArray(value) ? value[0] : value;
  return parseByFormat(normalized, format ?? getDefaultFormat(type)) ?? today;
}

function isDateDisabled(value: dayjs.Dayjs) {
  if (minDate.value && value.endOf("day").isBefore(minDate.value.startOf("day"))) {
    return true;
  }

  if (maxDate.value && value.startOf("day").isAfter(maxDate.value.endOf("day"))) {
    return true;
  }

  return props.disabledDate?.(value.toDate()) ?? false;
}

function isSameValue(left: dayjs.Dayjs | null, right: dayjs.Dayjs | null) {
  if (!left || !right) {
    return false;
  }

  switch (props.type) {
    case "month":
      return left.isSame(right, "month");
    case "year":
      return left.isSame(right, "year");
    case "week":
      return left.startOf("week").isSame(right.startOf("week"), "day");
    default:
      return left.isSame(right, "day");
  }
}

function isInRange(value: dayjs.Dayjs) {
  const [start, end] = rangeMode.value ? draftRange.value : [selectedDates.value[0], selectedDates.value[1]];

  if (!start || !end) {
    return false;
  }

  const min = start.isBefore(end) ? start : end;
  const max = start.isBefore(end) ? end : start;
  return (value.isAfter(min, "day") || value.isSame(min, "day")) && (value.isBefore(max, "day") || value.isSame(max, "day"));
}

function syncPanelState() {
  const [start, end] = selectedDates.value;
  const anchor = start ?? today;

  currentPanelDate.value = anchor;
  focusedDate.value = anchor;
  draftRange.value = [start, end];
}

async function openPanel() {
  if (mergedDisabled.value || open.value) {
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

function emitValue(value: DatePickerValue) {
  selectedValue.value = value;
  emit("update:modelValue", value);
  emit("change", value);
}

async function applySingleValue(value: dayjs.Dayjs) {
  const output = formatByPattern(value, modelFormat.value);
  emitValue(output);
  await closePanel(false, true);
  await formItem?.validate("change");
}

async function applyRangeValue(start: dayjs.Dayjs, end: dayjs.Dayjs) {
  const sorted = start.isBefore(end) ? [start, end] : [end, start];
  emitValue([
    formatByPattern(sorted[0], modelFormat.value),
    formatByPattern(sorted[1], modelFormat.value)
  ]);
  draftRange.value = [sorted[0], sorted[1]];
  await closePanel(false, true);
  await formItem?.validate("change");
}

async function handleDateSelect(value: dayjs.Dayjs) {
  if (isDateDisabled(value)) {
    return;
  }

  if (!rangeMode.value) {
    await applySingleValue(adaptValueByType(value));
    return;
  }

  const [start, end] = draftRange.value;

  if (!start || (start && end)) {
    draftRange.value = [value.startOf("day"), null];
    return;
  }

  await applyRangeValue(start.startOf("day"), value.startOf("day"));
}

function adaptValueByType(value: dayjs.Dayjs) {
  switch (props.type) {
    case "month":
      return value.startOf("month");
    case "year":
      return value.startOf("year");
    case "week":
      return value.startOf("week");
    default:
      return value.startOf("day");
  }
}

async function clearValue(event: MouseEvent) {
  event.preventDefault();
  event.stopPropagation();
  selectedValue.value = null;
  draftRange.value = [null, null];
  emit("update:modelValue", null);
  emit("change", null);
  emit("clear");
  await formItem?.validate("change");
}

async function applyShortcut(shortcut: DatePickerShortcut) {
  const resolved = typeof shortcut.value === "function" ? shortcut.value() : shortcut.value;

  if (rangeMode.value) {
    if (Array.isArray(resolved)) {
      emitValue(resolved);
      await closePanel(false, true);
      await formItem?.validate("change");
    }
    return;
  }

  if (Array.isArray(resolved)) {
    return;
  }

  emitValue(resolved);
  await closePanel(false, true);
  await formItem?.validate("change");
}

function movePanel(step: number) {
  if (props.type === "year") {
    currentPanelDate.value = currentPanelDate.value.add(step * 12, "year");
    return;
  }

  currentPanelDate.value =
    props.type === "month" ? currentPanelDate.value.add(step, "year") : currentPanelDate.value.add(step, "month");
}

async function handleTriggerKeydown(event: KeyboardEvent) {
  if (mergedDisabled.value) {
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
      mergedDisabled ? 'is-disabled' : '',
      formItem?.validateState.value === 'error' ? 'is-error' : ''
    ]"
  >
    <div
      ref="triggerRef"
      class="xy-date-picker__trigger"
      role="combobox"
      :tabindex="mergedDisabled ? -1 : 0"
      :aria-expanded="open"
      :aria-controls="panelId"
      :aria-describedby="formItem?.message.value ? formItem.messageId : undefined"
      :aria-invalid="formItem?.validateState.value === 'error'"
      @click="openPanel"
      @keydown="handleTriggerKeydown"
    >
      <span
        class="xy-date-picker__selection"
        :class="hasDisplayValue ? 'is-value' : 'is-placeholder'"
      >
        {{ displayLabel }}
      </span>
      <span
        class="xy-date-picker__actions"
        :class="{ 'has-clear': props.clearable && hasDisplayValue && !mergedDisabled }"
      >
        <button
          v-if="props.clearable && hasDisplayValue && !mergedDisabled"
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
        >
          <span ref="panelArrowRef" class="xy-popper__arrow" :style="arrowStyle" />
          <header class="xy-date-picker__header">
            <button type="button" @click="movePanel(-1)">‹</button>
            <strong>
              {{
                props.type === 'year'
                  ? `${yearPanelStart} - ${yearPanelStart + 11}`
                  : props.type === 'month'
                    ? currentPanelDate.format('YYYY 年')
                    : currentPanelDate.format('YYYY 年 M 月')
              }}
            </strong>
            <button type="button" @click="movePanel(1)">›</button>
          </header>

          <div v-if="props.shortcuts.length" class="xy-date-picker__shortcuts">
            <button
              v-for="shortcut in props.shortcuts"
              :key="shortcut.label"
              type="button"
              class="xy-date-picker__shortcut"
              @click="applyShortcut(shortcut)"
            >
              {{ shortcut.label }}
            </button>
          </div>

          <template v-if="props.type === 'month'">
            <div class="xy-date-picker__months">
              <button
                v-for="cell in monthCells"
                :key="cell.key"
                type="button"
                class="xy-date-picker__cell xy-date-picker__cell--month"
                :class="isSameValue(cell.value, selectedDates[0]) ? 'is-selected' : ''"
                :disabled="cell.disabled"
                @click="handleDateSelect(cell.value)"
              >
                {{ cell.label }}
              </button>
            </div>
          </template>

          <template v-else-if="props.type === 'year'">
            <div class="xy-date-picker__years">
              <button
                v-for="cell in yearCells"
                :key="cell.key"
                type="button"
                class="xy-date-picker__cell xy-date-picker__cell--year"
                :class="isSameValue(cell.value, selectedDates[0]) ? 'is-selected' : ''"
                :disabled="cell.disabled"
                @click="handleDateSelect(cell.value)"
              >
                {{ cell.label }}
              </button>
            </div>
          </template>

          <template v-else>
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
                  isSameValue(dayjs(cell.date), selectedDates[0]) || isSameValue(dayjs(cell.date), selectedDates[1])
                    ? 'is-selected'
                    : '',
                  isInRange(dayjs(cell.date)) ? 'is-in-range' : '',
                  dayjs(cell.date).isSame(today, 'day') ? 'is-today' : ''
                ]"
                :disabled="cell.disabled"
                @mouseenter="focusedDate = dayjs(cell.date)"
                @click="handleDateSelect(dayjs(cell.date))"
              >
                {{ props.type === 'week' ? dayjs(cell.date).startOf('week').date() : cell.label }}
              </button>
            </div>
          </template>

          <footer class="xy-date-picker__footer">
            <button type="button" @click="handleDateSelect(today)">今天</button>
            <button type="button" @click="closePanel(true, true)">关闭</button>
          </footer>
        </div>
      </transition>
    </teleport>
  </div>
</template>
