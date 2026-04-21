<script setup lang="ts">
import { computed, ref } from "vue";
import type { RateProps } from "./rate";
import XyuIcon from "../icon/icon.vue";

defineOptions({ name: "XyuRate" });

const props = withDefaults(defineProps<RateProps>(), {
  modelValue: 0,
  max: 5,
  size: "md",
  disabled: false,
  readonly: false,
  allowHalf: false,
  allowClear: false,
  color: "var(--xyu-warning)",
  voidColor: "",
  disabledVoidColor: "",
  showText: false,
  textColor: ""
});

const emit = defineEmits<{
  "update:modelValue": [value: number];
  change: [value: number];
}>();

const ns = "xyu-rate";
const hoverValue = ref<number | null>(null);

const sizes = { sm: 18, md: 22, lg: 26 };
const iconSize = computed(() => sizes[props.size] ?? 22);

const currentValue = computed(() =>
  hoverValue.value !== null ? hoverValue.value : props.modelValue
);

const rateClasses = computed(() => [
  ns,
  `${ns}--${props.size}`,
  props.disabled ? "is-disabled" : "",
  props.readonly ? "is-readonly" : ""
]);

const textContent = computed(() => {
  if (!props.showText) return "";
  const texts = props.texts ?? ["极差", "差", "一般", "满意", "很满意"];
  const idx = Math.round(props.modelValue) - 1;
  return texts[idx] ?? "";
});

function getStarType(index: number): "full" | "half" | "void" {
  const val = currentValue.value;
  if (val >= index + 1) return "full";
  if (props.allowHalf && val > index && val < index + 1) return "half";
  return "void";
}

function handleClick(value: number) {
  if (props.disabled || props.readonly) return;
  let newValue = value;
  if (props.allowClear && props.modelValue === value) {
    newValue = 0;
  }
  emit("update:modelValue", newValue);
  emit("change", newValue);
}

function handleMouseMove(value: number) {
  if (props.disabled || props.readonly) return;
  hoverValue.value = value;
}

function handleMouseLeave() {
  hoverValue.value = null;
}
</script>

<template>
  <div
    :class="rateClasses"
    @mouseleave="handleMouseLeave"
  >
    <button
      v-for="i in props.max"
      :key="i"
      type="button"
      :class="[`${ns}__item`, getStarType(i - 1) === 'void' ? 'is-void' : 'is-filled']"
      :style="{
        width: `${iconSize}px`,
        height: `${iconSize}px`
      }"
      :disabled="props.disabled || props.readonly"
      @click="handleClick(i)"
      @mouseenter="handleMouseMove(i)"
    >
      <XyuIcon
        icon="mdi:star"
        :size="iconSize"
        :style="{
          color: getStarType(i - 1) !== 'void' ? props.color : undefined,
          clipPath: getStarType(i - 1) === 'half' ? 'inset(0 50% 0 0)' : undefined,
          position: 'absolute',
          top: 0, left: 0
        }"
      />
      <XyuIcon
        icon="mdi:star-outline"
        :size="iconSize"
        :style="{ color: props.voidColor || 'var(--xyu-bg-tertiary)' }"
      />
    </button>

    <span
      v-if="props.showText"
      :class="`${ns}__text`"
      :style="props.textColor ? { color: props.textColor } : {}"
    >
      {{ textContent }}
    </span>
  </div>
</template>
