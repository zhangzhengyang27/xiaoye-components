<script setup lang="ts">
import { computed } from "vue";
import type { SwitchProps } from "./switch";

const props = withDefaults(defineProps<SwitchProps>(), {
  modelValue: false,
  disabled: false,
  loading: false,
  size: "md",
  activeValue: true,
  inactiveValue: false
});

const emit = defineEmits<{
  "update:modelValue": [value: unknown];
  change: [value: unknown];
}>();

const ns = "xyu-switch";

const isChecked = computed(() => props.modelValue === props.activeValue);

function toggle() {
  if (props.disabled || props.loading) return;
  const newVal = isChecked.value ? props.inactiveValue : props.activeValue;
  emit("update:modelValue", newVal);
  emit("change", newVal);
}
</script>

<template>
  <button
    :class="[ns, `${ns}--${props.size}`, isChecked ? 'is-checked' : '', props.disabled ? 'is-disabled' : '', props.loading ? 'is-loading' : '']"
    type="button"
    role="switch"
    :aria-checked="isChecked"
    :disabled="props.disabled || props.loading"
    @click="toggle"
  >
    <span :class="`${ns}__track`">
      <span :class="`${ns}__thumb`" />
    </span>
    <span v-if="props.activeText || props.inactiveText" :class="`${ns}__label`">
      {{ isChecked ? props.activeText : props.inactiveText }}
    </span>
  </button>
</template>
