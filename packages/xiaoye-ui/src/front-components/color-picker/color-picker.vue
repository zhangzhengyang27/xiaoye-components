<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { ColorPickerProps, ColorPickerEmits } from "./color-picker";

const props = withDefaults(defineProps<ColorPickerProps>(), {
  modelValue: "#1e60ff",
  disabled: false,
  alpha: false,
  format: "hex",
  predefine: () => ["#1e60ff", "#67c23a", "#e6a23c", "#f56c6c", "#909399", "#ffffff", "#000000"]
});

const emit = defineEmits<ColorPickerEmits>();

const ns = "xyu-color-picker";
const visible = ref(false);
const hue = ref(220);
const saturation = ref(100);
const lightness = ref(50);
const alphaVal = ref(100);

const hexColor = computed(() => {
  return props.modelValue || "#1e60ff";
});

function parseHex(hex: string) {
  const result: Record<string, number> = {};
  if (hex.startsWith("#")) hex = hex.slice(1);
  if (hex.length === 3) hex = hex.split("").map(c => c + c).join("");
  if (hex.length === 6) {
    result.r = parseInt(hex.slice(0, 2), 16);
    result.g = parseInt(hex.slice(2, 4), 16);
    result.b = parseInt(hex.slice(4, 6), 16);
  }
  return result;
}

watch(() => props.modelValue, (val) => {
  if (val && val.startsWith("#")) {
    const p = parseHex(val);
    if (p.r !== undefined) {
      const [h, s, l] = rgbToHsl(p.r, p.g, p.b);
      hue.value = h;
      saturation.value = s;
      lightness.value = l;
    }
  }
}, { immediate: true });

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360; s /= 100; l /= 100;
  let r, g, b;
  if (s === 0) { r = g = b = l; }
  else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function hue2rgb(p: number, q: number, t: number) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

function hslToHex(h: number, s: number, l: number) {
  const [r, g, b] = hslToRgb(h, s, l);
  return "#" + [r, g, b].map(v => v.toString(16).padStart(2, "0")).join("");
}

function confirmColor() {
  const hex = hslToHex(hue.value, saturation.value, lightness.value);
  emit("update:modelValue", hex);
  emit("change", hex);
  visible.value = false;
}

function selectPredefine(color: string) {
  emit("update:modelValue", color);
  emit("change", color);
  visible.value = false;
}

const slots = defineSlots<{ default?: () => unknown }>();
</script>

<template>
  <div :class="[ns, props.disabled ? 'is-disabled' : '']">
    <div
      :class="`${ns}__trigger`"
      @click="!props.disabled && (visible = !visible)"
    >
      <div
        :class="`${ns}__color`"
        :style="{ background: props.modelValue }"
      />
      <span :class="`${ns}__value`">{{ props.modelValue }}</span>
    </div>

    <teleport to="body">
      <transition name="xyu-zoom-in-top">
        <div v-if="visible" :class="`${ns}__panel`">
          <!-- Saturation + Lightness gradient -->
          <div
            :class="`${ns}__sv`"
            :style="{ background: `linear-gradient(to right, #fff, hsl(${hue}, 100%, 50%))` }"
          >
            <div
              :class="`${ns}__sv-white`"
            />
            <div
              :class="`${ns}__sv-pointer`"
              :style="{
                left: `${saturation}%`,
                top: `${100 - lightness}%`,
                background: hslToHex(hue, saturation, lightness)
              }"
            />
          </div>

          <!-- Hue slider -->
          <div :class="`${ns}__hue`">
            <div
              :class="`${ns}__hue-pointer`"
              :style="{ left: `${(hue / 360) * 100}%` }"
            />
          </div>

          <!-- Predefine colors -->
          <div v-if="props.predefine?.length" :class="`${ns}__predefine`">
            <div
              v-for="color in props.predefine"
              :key="color"
              :class="[`${ns}__predefine-item`, color === props.modelValue ? 'is-selected' : '']"
              :style="{ background: color }"
              @click="selectPredefine(color)"
            />
          </div>

          <!-- Actions -->
          <div :class="`${ns}__actions`">
            <button type="button" :class="`${ns}__btn`" @click="visible = false">取消</button>
            <button type="button" :class="[`${ns}__btn`, `${ns}__btn--primary`]" @click="confirmColor">确认</button>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>
