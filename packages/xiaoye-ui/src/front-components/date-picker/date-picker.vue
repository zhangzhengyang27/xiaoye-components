<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import type { DatePickerProps, DatePickerEmits } from "./date-picker";
import XyuIcon from "../icon/icon.vue";

defineOptions({ name: "XyuDatePicker" });

const props = withDefaults(defineProps<DatePickerProps>(), {
  modelValue: "",
  type: "date",
  placeholder: "请选择日期",
  disabled: false,
  clearable: false,
  format: "YYYY-MM-DD"
});

const emit = defineEmits<DatePickerEmits>();

const ns = "xyu-date-picker";
const visible = ref(false);
const selectedDate = ref<Date | null>(null);
const viewYear = ref(new Date().getFullYear());
const viewMonth = ref(new Date().getMonth());
const triggerRef = ref<HTMLElement | null>(null);
const panelTop = ref(0);
const panelLeft = ref(0);

const weekDays = ["日", "一", "二", "三", "四", "五", "六"];

watch(() => props.modelValue, (val) => {
  if (val) {
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
      selectedDate.value = d;
      viewYear.value = d.getFullYear();
      viewMonth.value = d.getMonth();
    }
  } else {
    selectedDate.value = null;
  }
}, { immediate: true });

const displayText = computed(() => {
  if (!selectedDate.value) return "";
  const d = selectedDate.value;
  if (props.type === "date" || props.type === "datetime") {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    if (props.type === "datetime") {
      const h = String(d.getHours()).padStart(2, "0");
      const mi = String(d.getMinutes()).padStart(2, "0");
      const s = String(d.getSeconds()).padStart(2, "0");
      return `${y}-${m}-${day} ${h}:${mi}:${s}`;
    }
    return `${y}-${m}-${day}`;
  }
  if (props.type === "year") return String(d.getFullYear());
  if (props.type === "month") {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  }
  return "";
});

function getCalendarDays(): (Date | null)[] {
  const year = viewYear.value;
  const month = viewMonth.value;
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: (Date | null)[] = [];
  for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(year, month, d));
  return days;
}

const calendarDays = computed(() => getCalendarDays());

const panelStyle = computed(() => ({
  top: `${panelTop.value}px`,
  left: `${panelLeft.value}px`
}));

function updatePanelPosition() {
  if (!triggerRef.value) return;
  const rect = triggerRef.value.getBoundingClientRect();
  panelTop.value = rect.bottom + 4;
  panelLeft.value = rect.left;
}

function handleTriggerClick() {
  if (props.disabled) return;
  visible.value = !visible.value;
  if (visible.value) {
    updatePanelPosition();
  }
}

function prevYear() {
  viewYear.value--;
}

function nextYear() {
  viewYear.value++;
}

function prevMonth() {
  if (viewMonth.value === 0) { viewMonth.value = 11; viewYear.value--; }
  else viewMonth.value--;
}

function nextMonth() {
  if (viewMonth.value === 11) { viewMonth.value = 0; viewYear.value++; }
  else viewMonth.value++;
}

function selectDay(date: Date | null) {
  if (!date) return;
  if (props.disabledDate && props.disabledDate(date)) return;
  selectedDate.value = date;
  emitValue();
}

function emitValue() {
  if (!selectedDate.value) return;
  emit("update:modelValue", displayText.value);
  emit("change", displayText.value);
  visible.value = false;
}

function handleClear(e: Event) {
  e.stopPropagation();
  selectedDate.value = null;
  emit("update:modelValue", "");
  emit("change", "");
}

function isToday(date: Date | null) {
  if (!date) return false;
  const t = new Date();
  return date.getFullYear() === t.getFullYear() &&
    date.getMonth() === t.getMonth() &&
    date.getDate() === t.getDate();
}

function isSelected(date: Date | null) {
  if (!date || !selectedDate.value) return false;
  return date.getFullYear() === selectedDate.value.getFullYear() &&
    date.getMonth() === selectedDate.value.getMonth() &&
    date.getDate() === selectedDate.value.getDate();
}

function isDisabled(date: Date | null) {
  if (!date) return false;
  return props.disabledDate ? props.disabledDate(date) : false;
}

function handleClickOutside(e: MouseEvent) {
  if (!visible.value) return;
  const target = e.target as Node;
  const el = triggerRef.value;
  if (el && !el.contains(target)) {
    visible.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside, true);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside, true);
});
</script>

<template>
  <div :class="[ns, props.disabled ? 'is-disabled' : '']">
    <div
      ref="triggerRef"
      :class="[`${ns}__input`, visible ? 'is-focus' : '']"
      @click.stop="handleTriggerClick"
    >
      <input
        type="text"
        :class="`${ns}__inner`"
        :value="displayText"
        :placeholder="props.placeholder"
        readonly
        :disabled="props.disabled"
      />
      <span v-if="props.clearable && selectedDate" :class="`${ns}__clear`" @click.stop="handleClear">
      <XyuIcon icon="mdi:close" :size="12" />
      </span>
      <span v-else :class="`${ns}__icon`">
        <XyuIcon icon="mdi:calendar" :size="14" />
      </span>
    </div>

    <teleport to="body">
      <transition name="xyu-zoom-in-top">
        <div v-if="visible" :class="`${ns}__picker`" :style="panelStyle">
          <!-- Header -->
          <div :class="`${ns}__header`">
            <span :class="`${ns}__nav`" @click="prevYear" title="上一年">«</span>
            <span :class="`${ns}__nav`" @click="prevMonth">‹</span>
            <span :class="`${ns}__label`">{{ viewYear }}年 {{ viewMonth + 1 }}月</span>
            <span :class="`${ns}__nav`" @click="nextMonth">›</span>
            <span :class="`${ns}__nav`" @click="nextYear" title="下一年">»</span>
          </div>

          <!-- Week days -->
          <div :class="`${ns}__weekdays`">
            <span v-for="d in weekDays" :key="d" :class="`${ns}__weekday`">{{ d }}</span>
          </div>

          <!-- Days -->
          <div :class="`${ns}__days`">
            <span
              v-for="(date, idx) in calendarDays"
              :key="idx"
              :class="[
                `${ns}__day`,
                !date ? 'is-empty' : '',
                date && isToday(date) ? 'is-today' : '',
                date && isSelected(date) ? 'is-selected' : '',
                date && isDisabled(date) ? 'is-disabled' : ''
              ]"
              @click="selectDay(date)"
            >
              {{ date ? date.getDate() : "" }}
            </span>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>
