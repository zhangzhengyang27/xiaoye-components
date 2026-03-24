<script setup lang="ts">
import { computed, inject, nextTick, ref, watch } from "vue";
import {
  useConfig,
  useDismissibleLayer,
  useFloatingPanel,
  useListNavigation,
  useNamespace,
  useOverlayStack
} from "@xiaoye/composables";
import XyIcon from "../../icon";
import { formKey, formItemKey } from "../../form/src/context";
import {
  DEFAULT_CLEAR_ICON,
  DEFAULT_END,
  DEFAULT_FORMAT,
  DEFAULT_PLACEHOLDER,
  DEFAULT_PREFIX_ICON,
  DEFAULT_START,
  DEFAULT_STEP,
  DEFAULT_SUFFIX_ICON
} from "./time-select";
import type { TimeSelectOption, TimeSelectProps } from "./time-select";

const props = withDefaults(defineProps<TimeSelectProps>(), {
  modelValue: null,
  placeholder: DEFAULT_PLACEHOLDER,
  disabled: false,
  clearable: false,
  size: undefined,
  start: DEFAULT_START,
  end: DEFAULT_END,
  step: DEFAULT_STEP,
  minTime: undefined,
  maxTime: undefined,
  includeEndTime: false,
  format: DEFAULT_FORMAT,
  validateEvent: true
});

const emit = defineEmits<{
  "update:modelValue": [value: string | null];
  change: [value: string | null];
  clear: [];
  visibleChange: [value: boolean];
  focus: [];
  blur: [];
}>();

const form = inject(formKey, null);
const formItem = inject(formItemKey, null);
const ns = useNamespace("time-select");
const { size: globalSize } = useConfig();
const mergedSize = computed(() => props.size ?? globalSize.value);
const triggerRef = ref<HTMLElement | null>(null);
const dropdownRef = ref<HTMLElement | null>(null);
const dropdownArrowRef = ref<HTMLElement | null>(null);
const open = ref(false);
const selectedValue = ref<string | null>(props.modelValue);
const listboxId = `xy-time-select-listbox-${Math.random().toString(36).slice(2, 10)}`;
const { zIndex, isTopMost, openLayer, closeLayer } = useOverlayStack();

const { actualPlacement, arrowStyle, floatingStyle, updatePosition, startAutoUpdate, stopAutoUpdate } = useFloatingPanel(
  triggerRef,
  dropdownRef,
  {
    arrowRef: dropdownArrowRef,
    placement: "bottom-start",
    offset: 8,
    matchTriggerWidth: true,
    zIndex
  }
);

function parseTime(value?: string | null) {
  if (!value) {
    return null;
  }

  const normalized = value.trim();
  const match = normalized.match(/^(\d{1,2}):(\d{2})(?:\s*([AaPp][Mm]))?$/);

  if (!match) {
    return null;
  }

  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const meridiem = match[3]?.toLowerCase();

  if (Number.isNaN(hour) || Number.isNaN(minute) || minute < 0 || minute > 59) {
    return null;
  }

  if (meridiem) {
    if (hour < 1 || hour > 12) {
      return null;
    }

    if (meridiem === "pm" && hour !== 12) {
      hour += 12;
    }

    if (meridiem === "am" && hour === 12) {
      hour = 0;
    }
  } else if (hour < 0 || hour > 23) {
    return null;
  }

  return hour * 60 + minute;
}

function formatTime(totalMinutes: number, pattern: string) {
  const minutes = Math.max(0, Math.min(totalMinutes, 23 * 60 + 59));
  const hour24 = Math.floor(minutes / 60);
  const minute = minutes % 60;
  const hour12 = hour24 % 12 || 12;
  const tokens: Record<string, string> = {
    HH: `${hour24}`.padStart(2, "0"),
    H: `${hour24}`,
    hh: `${hour12}`.padStart(2, "0"),
    h: `${hour12}`,
    mm: `${minute}`.padStart(2, "0"),
    A: hour24 < 12 ? "AM" : "PM",
    a: hour24 < 12 ? "am" : "pm"
  };

  return pattern.replace(/HH|H|hh|h|mm|A|a/g, (token) => tokens[token] ?? token);
}

function toValue(totalMinutes: number) {
  return formatTime(totalMinutes, props.format);
}

function buildOptions() {
  const startMinutes = parseTime(props.start);
  const endMinutes = parseTime(props.end);
  const stepMinutes = parseTime(props.step);
  const minMinutes = parseTime(props.minTime);
  const maxMinutes = parseTime(props.maxTime);

  if (
    startMinutes === null ||
    endMinutes === null ||
    stepMinutes === null ||
    stepMinutes <= 0 ||
    endMinutes < startMinutes
  ) {
    return [] as TimeSelectOption[];
  }

  const options: TimeSelectOption[] = [];
  let current = startMinutes;

  while (current < endMinutes) {
    options.push({
      value: toValue(current),
      label: toValue(current),
      disabled:
        (minMinutes !== null && current < minMinutes) || (maxMinutes !== null && current > maxMinutes),
      totalMinutes: current
    });
    current += stepMinutes;
  }

  if (props.includeEndTime || current === endMinutes) {
    const alreadyIncluded = options[options.length - 1]?.totalMinutes === endMinutes;

    if (!alreadyIncluded) {
      options.push({
        value: toValue(endMinutes),
        label: toValue(endMinutes),
        disabled:
          (minMinutes !== null && endMinutes < minMinutes) ||
          (maxMinutes !== null && endMinutes > maxMinutes),
        totalMinutes: endMinutes
      });
    }
  }

  return options;
}

const options = computed(() => buildOptions());
const selectedMinutes = computed(() => parseTime(selectedValue.value));
const displayLabel = computed(() => {
  if (selectedMinutes.value !== null) {
    return toValue(selectedMinutes.value);
  }

  return props.placeholder;
});
const emptyText = computed(() => {
  const startMinutes = parseTime(props.start);
  const endMinutes = parseTime(props.end);
  const stepMinutes = parseTime(props.step);

  if (
    startMinutes === null ||
    endMinutes === null ||
    stepMinutes === null ||
    stepMinutes <= 0 ||
    endMinutes < startMinutes
  ) {
    return "时间配置无效";
  }

  return "暂无可选时间";
});

const navigation = useListNavigation(() => options.value, {
  loop: true
});
const activeOption = computed(() => navigation.activeItem.value);

function syncActiveIndex() {
  const index = options.value.findIndex(
    (option) => option.totalMinutes === selectedMinutes.value && !option.disabled
  );

  if (index >= 0) {
    navigation.setActiveIndex(index);
    return;
  }

  navigation.activateFirst();
}

function syncFormModel(value: string | null) {
  if (!form || !formItem?.prop) {
    return;
  }

  form.props.model[formItem.prop] = value;
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
  navigation.setActiveIndex(-1);

  if (restoreFocus) {
    await nextTick();
    triggerRef.value?.focus();
  }

  if (shouldValidate && props.validateEvent) {
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

async function selectOption(option: TimeSelectOption) {
  if (option.disabled) {
    return;
  }

  selectedValue.value = option.value;
  syncFormModel(option.value);
  formItem?.clearValidate();
  emit("update:modelValue", option.value);
  await nextTick();
  emit("change", option.value);
  await closeDropdown(false, true);

  if (props.validateEvent) {
    await formItem?.validate("change");
  }
}

async function clearValue(event: MouseEvent) {
  event.preventDefault();
  event.stopPropagation();
  selectedValue.value = null;
  syncFormModel(null);
  emit("update:modelValue", null);
  await nextTick();
  emit("change", null);
  emit("clear");

  if (props.validateEvent) {
    await formItem?.validate("change");
  }
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

watch(
  () => [props.start, props.end, props.step, props.minTime, props.maxTime, props.includeEndTime, props.format],
  async () => {
    if (!open.value) {
      return;
    }

    syncActiveIndex();
    await nextTick();
    await updatePosition();
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
    :class="[
      ns.base.value,
      `${ns.base.value}--${mergedSize}`,
      props.disabled ? 'is-disabled' : '',
      open ? 'is-open' : '',
      formItem?.validateState.value === 'error' ? 'is-error' : ''
    ]"
  >
    <div
      ref="triggerRef"
      class="xy-time-select__trigger"
      role="combobox"
      :tabindex="props.disabled ? -1 : 0"
      :aria-expanded="open"
      :aria-controls="listboxId"
      :aria-activedescendant="open && navigation.activeIndex.value >= 0 ? `${listboxId}-${navigation.activeIndex.value}` : undefined"
      :aria-describedby="formItem?.message.value ? formItem.messageId : undefined"
      :aria-invalid="formItem?.validateState.value === 'error'"
      @click="toggleDropdown"
      @keydown="handleKeydown"
    >
      <span class="xy-time-select__prefix">
        <XyIcon class="xy-time-select__icon" :icon="DEFAULT_PREFIX_ICON" :size="16" />
      </span>
      <span :class="['xy-time-select__selection', selectedMinutes !== null ? 'is-selected' : 'is-placeholder']">
        {{ displayLabel }}
      </span>
      <span class="xy-time-select__actions">
        <button
          v-if="props.clearable && selectedValue && !props.disabled"
          type="button"
          class="xy-time-select__clear"
          aria-label="clear"
          @click="clearValue"
        >
          <XyIcon class="xy-time-select__icon" :icon="DEFAULT_CLEAR_ICON" :size="16" />
        </button>
        <span class="xy-time-select__caret">
          <XyIcon class="xy-time-select__icon" :icon="DEFAULT_SUFFIX_ICON" :size="16" />
        </span>
      </span>
    </div>

    <teleport to="body">
      <transition name="xy-fade">
        <div
          v-if="open"
          :id="listboxId"
          ref="dropdownRef"
          class="xy-time-select__dropdown"
          :style="floatingStyle"
          :data-placement="actualPlacement"
          role="listbox"
        >
          <span ref="dropdownArrowRef" class="xy-popper__arrow" :style="arrowStyle" />
          <div class="xy-time-select__content">
            <button
              v-for="(option, index) in options"
              :id="`${listboxId}-${index}`"
              :key="option.value"
              type="button"
              class="xy-time-select__option"
              :class="[
                option.disabled ? 'is-disabled' : '',
                option.totalMinutes === selectedMinutes ? 'is-selected' : '',
                navigation.activeIndex.value === index ? 'is-active' : ''
              ]"
              role="option"
              :aria-selected="option.totalMinutes === selectedMinutes"
              :disabled="option.disabled"
              @mouseenter="navigation.setActiveIndex(index)"
              @click="selectOption(option)"
            >
              <span>{{ option.label }}</span>
            </button>
            <div v-if="!options.length" class="xy-time-select__empty">{{ emptyText }}</div>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>
