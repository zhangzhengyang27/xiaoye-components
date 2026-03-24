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
import type { TimePickerProps, TimePickerValue } from "./time-picker";

interface TimeParts {
  hour: number;
  minute: number;
  second: number;
}

type SectionKey = "single" | "start" | "end";
type UnitKey = "hour" | "minute" | "second";

const props = withDefaults(defineProps<TimePickerProps>(), {
  modelValue: null,
  placeholder: "请选择时间",
  startPlaceholder: "开始时间",
  endPlaceholder: "结束时间",
  disabled: false,
  clearable: false,
  size: undefined,
  format: "HH:mm:ss",
  isRange: false,
  validateEvent: true,
  disabledHours: undefined,
  disabledMinutes: undefined,
  disabledSeconds: undefined
});

const emit = defineEmits<{
  "update:modelValue": [value: TimePickerValue];
  change: [value: TimePickerValue];
  clear: [];
  visibleChange: [value: boolean];
  focus: [];
  blur: [];
}>();

const formItem = inject(formItemKey, null);
const ns = useNamespace("time-picker");
const { size: globalSize } = useConfig();
const mergedSize = computed<ComponentSize>(() => props.size ?? globalSize.value);

const triggerRef = ref<HTMLElement | null>(null);
const panelRef = ref<HTMLElement | null>(null);
const panelArrowRef = ref<HTMLElement | null>(null);
const open = ref(false);
const currentValue = ref<TimePickerValue>(props.modelValue);
const panelId = `xy-time-panel-${Math.random().toString(36).slice(2, 10)}`;
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

const showSeconds = computed(() => props.format.includes("ss"));
const mergedColumnsStyle = computed(() => ({
  gridTemplateColumns: showSeconds.value ? "repeat(3, minmax(0, 1fr))" : "repeat(2, minmax(0, 1fr))"
}));

const defaultTime = computed(() => getFirstAvailableTime() ?? { hour: 0, minute: 0, second: 0 });

const draftSingle = ref<TimeParts>(defaultTime.value);
const draftRangeStart = ref<TimeParts>(defaultTime.value);
const draftRangeEnd = ref<TimeParts>(defaultTime.value);

const displaySingle = computed(() =>
  typeof currentValue.value === "string" && currentValue.value ? currentValue.value : props.placeholder
);
const displayRangeStart = computed(() =>
  Array.isArray(currentValue.value) && currentValue.value[0] ? currentValue.value[0] : props.startPlaceholder
);
const displayRangeEnd = computed(() =>
  Array.isArray(currentValue.value) && currentValue.value[1] ? currentValue.value[1] : props.endPlaceholder
);

const rootKls = computed(() => [
  ns.base.value,
  `${ns.base.value}--${mergedSize.value}`,
  open.value ? "is-open" : "",
  props.isRange ? "is-range" : "",
  props.disabled ? "is-disabled" : "",
  formItem?.validateState.value === "error" ? "is-error" : ""
]);

const singleColumns = computed(() => buildColumns("single"));
const startColumns = computed(() => buildColumns("start"));
const endColumns = computed(() => buildColumns("end"));

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function cloneParts(value: TimeParts) {
  return {
    hour: value.hour,
    minute: value.minute,
    second: value.second
  };
}

function getNowParts(): TimeParts {
  const now = new Date();
  return {
    hour: now.getHours(),
    minute: now.getMinutes(),
    second: now.getSeconds()
  };
}

function compareParts(left: TimeParts, right: TimeParts) {
  if (left.hour !== right.hour) {
    return left.hour - right.hour;
  }

  if (left.minute !== right.minute) {
    return left.minute - right.minute;
  }

  return left.second - right.second;
}

function formatTime(parts: TimeParts) {
  return props.format
    .replace(/HH/g, pad(parts.hour))
    .replace(/mm/g, pad(parts.minute))
    .replace(/ss/g, pad(parts.second));
}

function parseTime(value?: string | null) {
  if (!value) {
    return null;
  }

  const [hourText, minuteText, secondText = "0"] = value.split(":");
  const hour = Number(hourText);
  const minute = Number(minuteText);
  const second = Number(secondText);

  if (
    !Number.isInteger(hour) ||
    !Number.isInteger(minute) ||
    !Number.isInteger(second) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59 ||
    second < 0 ||
    second > 59
  ) {
    return null;
  }

  return {
    hour,
    minute,
    second
  };
}

function isHourDisabled(hour: number) {
  return props.disabledHours?.().includes(hour) ?? false;
}

function isMinuteDisabled(hour: number, minute: number) {
  return props.disabledMinutes?.(hour).includes(minute) ?? false;
}

function isSecondDisabled(hour: number, minute: number, second: number) {
  return props.disabledSeconds?.(hour, minute).includes(second) ?? false;
}

function isTimeDisabled(parts: TimeParts) {
  if (isHourDisabled(parts.hour)) {
    return true;
  }

  if (isMinuteDisabled(parts.hour, parts.minute)) {
    return true;
  }

  if (showSeconds.value && isSecondDisabled(parts.hour, parts.minute, parts.second)) {
    return true;
  }

  return false;
}

function getSectionDraft(section: SectionKey) {
  if (section === "single") {
    return draftSingle.value;
  }

  return section === "start" ? draftRangeStart.value : draftRangeEnd.value;
}

function setSectionDraft(section: SectionKey, value: TimeParts) {
  if (section === "single") {
    draftSingle.value = value;
    return;
  }

  if (section === "start") {
    draftRangeStart.value = value;
    return;
  }

  draftRangeEnd.value = value;
}

function getFirstAvailableTime() {
  for (let hour = 0; hour < 24; hour += 1) {
    if (isHourDisabled(hour)) {
      continue;
    }

    for (let minute = 0; minute < 60; minute += 1) {
      if (isMinuteDisabled(hour, minute)) {
        continue;
      }

      if (!showSeconds.value) {
        return {
          hour,
          minute,
          second: 0
        };
      }

      for (let second = 0; second < 60; second += 1) {
        if (isSecondDisabled(hour, minute, second)) {
          continue;
        }

        return {
          hour,
          minute,
          second
        };
      }
    }
  }

  return null;
}

function normalizeParts(parts: TimeParts | null) {
  const candidate = parts ? cloneParts(parts) : cloneParts(defaultTime.value);

  if (isTimeDisabled(candidate)) {
    return cloneParts(getFirstAvailableTime() ?? defaultTime.value);
  }

  if (!showSeconds.value) {
    candidate.second = 0;
  }

  return candidate;
}

function syncDraftFromModel() {
  if (props.isRange) {
    const value = Array.isArray(currentValue.value) ? currentValue.value : null;
    const start = normalizeParts(parseTime(value?.[0] ?? null));
    const end = normalizeParts(parseTime(value?.[1] ?? null));
    draftRangeStart.value = start;
    draftRangeEnd.value = compareParts(start, end) <= 0 ? end : start;
    return;
  }

  draftSingle.value = normalizeParts(parseTime(typeof currentValue.value === "string" ? currentValue.value : null));
}

function buildColumns(section: SectionKey) {
  const draft = getSectionDraft(section);
  const columns: Array<{
    key: UnitKey;
    label: string;
    values: Array<{ value: number; selected: boolean; disabled: boolean }>;
  }> = [
    {
      key: "hour",
      label: "时",
      values: Array.from({ length: 24 }, (_, value) => ({
        value,
        selected: draft.hour === value,
        disabled: isHourDisabled(value)
      }))
    },
    {
      key: "minute",
      label: "分",
      values: Array.from({ length: 60 }, (_, value) => ({
        value,
        selected: draft.minute === value,
        disabled: isHourDisabled(draft.hour) || isMinuteDisabled(draft.hour, value)
      }))
    }
  ];

  if (showSeconds.value) {
    columns.push({
      key: "second",
      label: "秒",
      values: Array.from({ length: 60 }, (_, value) => ({
        value,
        selected: draft.second === value,
        disabled:
          isHourDisabled(draft.hour) ||
          isMinuteDisabled(draft.hour, draft.minute) ||
          isSecondDisabled(draft.hour, draft.minute, value)
      }))
    });
  }

  return columns;
}

function clearStaleValidation() {
  if (formItem?.validateState.value === "error") {
    formItem.clearValidate();
  }
}

async function openPanel() {
  if (props.disabled || open.value) {
    return;
  }

  open.value = true;
  emit("visibleChange", true);
  emit("focus");
  syncDraftFromModel();
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

async function emitChangeValue(nextValue: TimePickerValue) {
  currentValue.value = nextValue;
  clearStaleValidation();
  emit("update:modelValue", nextValue);
  emit("change", nextValue);
  await closePanel(false, true);

  if (props.validateEvent) {
    await formItem?.validate("change");
  }
}

async function confirmSelection() {
  if (props.isRange) {
    let start = cloneParts(draftRangeStart.value);
    let end = cloneParts(draftRangeEnd.value);

    if (compareParts(start, end) > 0) {
      [start, end] = [end, start];
    }

    await emitChangeValue([formatTime(start), formatTime(end)]);
    return;
  }

  await emitChangeValue(formatTime(draftSingle.value));
}

async function clearValue(event: MouseEvent) {
  event.preventDefault();
  event.stopPropagation();
  currentValue.value = null;
  emit("update:modelValue", null);
  emit("change", null);
  emit("clear");

  if (props.validateEvent) {
    await formItem?.validate("change");
  }
}

async function selectNow() {
  const now = normalizeParts(getNowParts());

  if (props.isRange) {
    draftRangeStart.value = cloneParts(now);
    draftRangeEnd.value = cloneParts(now);
    await emitChangeValue([formatTime(now), formatTime(now)]);
    return;
  }

  draftSingle.value = now;
  await emitChangeValue(formatTime(now));
}

function updatePart(section: SectionKey, unit: UnitKey, value: number) {
  const draft = cloneParts(getSectionDraft(section));
  draft[unit] = value;
  setSectionDraft(section, normalizeParts(draft));
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
    case "Escape":
      event.preventDefault();
      await closePanel(true, true);
      break;
    case "Enter":
      event.preventDefault();
      await confirmSelection();
      break;
    default:
      break;
  }
}

watch(
  () => props.modelValue,
  (value) => {
    currentValue.value = value;

    if (!open.value) {
      syncDraftFromModel();
    }
  },
  {
    immediate: true
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
  <div :class="rootKls">
    <div
      :id="formItem?.inputId"
      ref="triggerRef"
      class="xy-time-picker__trigger"
      role="combobox"
      :tabindex="props.disabled ? -1 : 0"
      :aria-expanded="open"
      :aria-controls="panelId"
      :aria-describedby="formItem?.message.value ? formItem.messageId : undefined"
      :aria-invalid="formItem?.validateState.value === 'error'"
      @click="openPanel"
      @keydown="handleTriggerKeydown"
    >
      <span class="xy-time-picker__selection">
        <template v-if="props.isRange">
          <span
            :class="[
              'xy-time-picker__value',
              Array.isArray(currentValue) && currentValue[0] ? 'is-value' : 'is-placeholder'
            ]"
          >
            {{ displayRangeStart }}
          </span>
          <span class="xy-time-picker__separator">—</span>
          <span
            :class="[
              'xy-time-picker__value',
              Array.isArray(currentValue) && currentValue[1] ? 'is-value' : 'is-placeholder'
            ]"
          >
            {{ displayRangeEnd }}
          </span>
        </template>
        <span
          v-else
          :class="[
            'xy-time-picker__value',
            typeof currentValue === 'string' && currentValue ? 'is-value' : 'is-placeholder'
          ]"
        >
          {{ displaySingle }}
        </span>
      </span>

      <span class="xy-time-picker__actions">
        <button
          v-if="props.clearable && currentValue && !props.disabled"
          type="button"
          class="xy-time-picker__clear"
          aria-label="clear"
          @click="clearValue"
        >
          <XyIcon class="xy-time-picker__icon" icon="mdi:close-circle" :size="16" />
        </button>
        <span class="xy-time-picker__caret">
          <XyIcon class="xy-time-picker__icon" icon="mdi:chevron-down" :size="16" />
        </span>
      </span>
    </div>

    <teleport to="body">
      <transition name="xy-fade">
        <div
          v-if="open"
          :id="panelId"
          ref="panelRef"
          class="xy-time-picker__panel"
          :class="props.isRange ? 'is-range' : ''"
          :style="floatingStyle"
          :data-placement="actualPlacement"
          role="dialog"
          tabindex="-1"
          @keydown="handlePanelKeydown"
        >
          <span ref="panelArrowRef" class="xy-popper__arrow" :style="arrowStyle" />
          <div class="xy-time-picker__body">
            <section v-if="props.isRange" class="xy-time-picker__section">
              <header class="xy-time-picker__section-title">开始时间</header>
              <div class="xy-time-picker__columns" :style="mergedColumnsStyle">
                <div
                  v-for="column in startColumns"
                  :key="`start-${column.key}`"
                  class="xy-time-picker__column"
                >
                  <span class="xy-time-picker__column-label">{{ column.label }}</span>
                  <div class="xy-time-picker__column-list">
                    <button
                      v-for="item in column.values"
                      :key="`start-${column.key}-${item.value}`"
                      type="button"
                      class="xy-time-picker__option"
                      :class="item.selected ? 'is-selected' : ''"
                      :disabled="item.disabled"
                      :data-time-section="'start'"
                      :data-time-unit="column.key"
                      :data-time-value="pad(item.value)"
                      @click="updatePart('start', column.key, item.value)"
                    >
                      {{ pad(item.value) }}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section class="xy-time-picker__section">
              <header v-if="props.isRange" class="xy-time-picker__section-title">结束时间</header>
              <div class="xy-time-picker__columns" :style="mergedColumnsStyle">
                <div
                  v-for="column in props.isRange ? endColumns : singleColumns"
                  :key="`${props.isRange ? 'end' : 'single'}-${column.key}`"
                  class="xy-time-picker__column"
                >
                  <span class="xy-time-picker__column-label">{{ column.label }}</span>
                  <div class="xy-time-picker__column-list">
                    <button
                      v-for="item in column.values"
                      :key="`${props.isRange ? 'end' : 'single'}-${column.key}-${item.value}`"
                      type="button"
                      class="xy-time-picker__option"
                      :class="item.selected ? 'is-selected' : ''"
                      :disabled="item.disabled"
                      :data-time-section="props.isRange ? 'end' : 'single'"
                      :data-time-unit="column.key"
                      :data-time-value="pad(item.value)"
                      @click="updatePart(props.isRange ? 'end' : 'single', column.key, item.value)"
                    >
                      {{ pad(item.value) }}
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <footer class="xy-time-picker__footer">
            <button type="button" class="xy-time-picker__action" @click="selectNow">现在</button>
            <button type="button" class="xy-time-picker__action" @click="closePanel(true, true)">关闭</button>
            <button
              type="button"
              class="xy-time-picker__action xy-time-picker__action--primary"
              @click="confirmSelection"
            >
              确定
            </button>
          </footer>
        </div>
      </transition>
    </teleport>
  </div>
</template>
