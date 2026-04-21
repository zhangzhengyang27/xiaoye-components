<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { TimePickerProps, TimePickerEmits } from "./time-picker";

const props = withDefaults(defineProps<TimePickerProps>(), {
  modelValue: "",
  placeholder: "选择时间",
  disabled: false,
  clearable: false,
  format: "HH:mm:ss",
  step: () => ({ hour: 1, minute: 1, second: 1 })
});

const emit = defineEmits<TimePickerEmits>();

const ns = "xyu-time-picker";
const visible = ref(false);
const hour = ref(0);
const minute = ref(0);
const second = ref(0);

watch(() => props.modelValue, (val) => {
  if (val) {
    const parts = val.split(":");
    hour.value = parseInt(parts[0] || "0", 10);
    minute.value = parseInt(parts[1] || "0", 10);
    second.value = parseInt(parts[2] || "0", 10);
  }
}, { immediate: true });

const displayText = computed(() => {
  if (!props.modelValue) return "";
  return props.modelValue;
});

function fmt(n: number) { return String(n).padStart(2, "0"); }

const hours = Array.from({ length: 24 }, (_, i) => i);
const minutes = Array.from({ length: 60 }, (_, i) => i);
const seconds = Array.from({ length: 60 }, (_, i) => i);

function selectHour(h: number) { hour.value = h; }
function selectMinute(m: number) { minute.value = m; }
function selectSecond(s: number) { second.value = s; }

function confirm() {
  const val = `${fmt(hour.value)}:${fmt(minute.value)}:${fmt(second.value)}`;
  emit("update:modelValue", val);
  emit("change", val);
  visible.value = false;
}

function handleClear(e: Event) {
  e.stopPropagation();
  emit("update:modelValue", "");
  emit("change", "");
}

const slots = defineSlots<{ default?: () => unknown }>();
</script>

<template>
  <div :class="[ns, props.disabled ? 'is-disabled' : '']">
    <div
      :class="[`${ns}__input`, visible ? 'is-focus' : '']"
      @click="!props.disabled && (visible = !visible)"
    >
      <input
        type="text"
        :class="`${ns}__inner`"
        :value="displayText"
        :placeholder="props.placeholder"
        readonly
        :disabled="props.disabled"
      />
      <span v-if="props.clearable && props.modelValue" :class="`${ns}__clear`" @click="handleClear">✕</span>
      <span v-else :class="`${ns}__icon`">🕐</span>
    </div>

    <teleport to="body">
      <transition name="xyu-zoom-in-top">
        <div v-if="visible" :class="`${ns}__panel`">
          <div :class="`${ns}__body`">
            <!-- Hour -->
            <div :class="`${ns}__column`">
              <div :class="`${ns}__column-label`">时</div>
              <div :class="`${ns}__column-list`">
                <div
                  v-for="h in hours"
                  :key="h"
                  :class="[`${ns}__item`, h === hour ? 'is-selected' : '']"
                  @click="selectHour(h)"
                >{{ fmt(h) }}</div>
              </div>
            </div>
            <!-- Minute -->
            <div :class="`${ns}__column`">
              <div :class="`${ns}__column-label`">分</div>
              <div :class="`${ns}__column-list`">
                <div
                  v-for="m in minutes"
                  :key="m"
                  :class="[`${ns}__item`, m === minute ? 'is-selected' : '']"
                  @click="selectMinute(m)"
                >{{ fmt(m) }}</div>
              </div>
            </div>
            <!-- Second -->
            <div :class="`${ns}__column`">
              <div :class="`${ns}__column-label`">秒</div>
              <div :class="`${ns}__column-list`">
                <div
                  v-for="s in seconds"
                  :key="s"
                  :class="[`${ns}__item`, s === second ? 'is-selected' : '']"
                  @click="selectSecond(s)"
                >{{ fmt(s) }}</div>
              </div>
            </div>
          </div>
          <div :class="`${ns}__footer`">
            <button type="button" :class="`${ns}__btn`" @click="visible = false">取消</button>
            <button type="button" :class="[`${ns}__btn`, `${ns}__btn--primary`]" @click="confirm">确定</button>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>
