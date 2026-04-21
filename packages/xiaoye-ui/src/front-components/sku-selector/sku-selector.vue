<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { PropType } from "vue";
import { useNamespace } from "xiaoye-primitives";

export type SkuOptionType = "color" | "size" | "image" | "text";

export interface SkuOption {
  value: string;
  label?: string;
  color?: string;
  image?: string;
  disabled?: boolean;
  [key: string]: unknown;
}

export interface SkuDimension {
  name: string;
  type: SkuOptionType;
  options: SkuOption[];
}

export interface SkuMatrix {
  [key: string]: {
    stock: number;
    price?: number;
    [key: string]: unknown;
  };
}

export interface SkuSelectorProps {
  dimensions: SkuDimension[];
  modelValue?: Record<string, string>;
  matrix?: SkuMatrix;
  showStock?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<SkuSelectorProps>(), {
  dimensions: () => [],
  modelValue: () => ({}),
  matrix: () => ({}),
  showStock: true,
  disabled: false
});

const emit = defineEmits<{
  "update:modelValue": [value: Record<string, string>];
  change: [value: Record<string, string>];
}>();

const slots = defineSlots<{
  "dimension-label"?: (props: { dimension: SkuDimension }) => unknown;
  "option"?: (props: { option: SkuOption; active: boolean; disabled: boolean }) => unknown;
  stock?: (props: { totalStock: number; available: boolean }) => unknown;
}>();

const ns = useNamespace("sku-selector");

const selectedValues = ref<Record<string, string>>({ ...props.modelValue });

const selectedKey = computed(() => {
  return Object.keys(selectedValues.value)
    .sort()
    .map((k) => selectedValues.value[k])
    .join(";");
});

const totalStock = computed(() => {
  if (!props.matrix || Object.keys(props.matrix).length === 0) {
    return Infinity;
  }

  const key = selectedKey.value;
  if (key && props.matrix[key]) {
    return props.matrix[key].stock;
  }

  let total = 0;
  Object.values(props.matrix).forEach((item) => {
    total += item.stock || 0;
  });
  return total;
});

const availableStock = computed(() => {
  if (!props.matrix || Object.keys(props.matrix).length === 0) {
    return true;
  }

  const key = selectedKey.value;
  if (!key) return true;

  return props.matrix[key]?.stock > 0;
});

function getOptionDisabled(dimensionName: string, optionValue: string): boolean {
  if (props.disabled) return true;

  const tempSelection = { ...selectedValues.value, [dimensionName]: optionValue };
  const tempKey = Object.keys(tempSelection)
    .sort()
    .map((k) => tempSelection[k])
    .join(";");

  if (props.matrix && Object.keys(props.matrix).length > 0) {
    if (tempKey && props.matrix[tempKey]) {
      return props.matrix[tempKey].stock <= 0;
    }

    const hasExactMatch = Object.keys(props.matrix).some((skuKey) => {
      const parts = skuKey.split(";");
      return Object.values(tempSelection).every((val) => parts.includes(val));
    });

    if (!hasExactMatch) {
      const allSelected = Object.keys(tempSelection).length === props.dimensions.length;
      if (allSelected) {
        return true;
      }
    }
  }

  return false;
}

function isOptionSelected(dimensionName: string, optionValue: string): boolean {
  return selectedValues.value[dimensionName] === optionValue;
}

function selectOption(dimensionName: string, optionValue: string, disabled: boolean) {
  if (disabled) return;

  if (selectedValues.value[dimensionName] === optionValue) {
    const newValues = { ...selectedValues.value };
    delete newValues[dimensionName];
    selectedValues.value = newValues;
  } else {
    selectedValues.value = {
      ...selectedValues.value,
      [dimensionName]: optionValue
    };
  }

  emit("update:modelValue", { ...selectedValues.value });
  emit("change", { ...selectedValues.value });
}

function clearSelection() {
  selectedValues.value = {};
  emit("update:modelValue", {});
  emit("change", {});
}

watch(
  () => props.modelValue,
  (val) => {
    selectedValues.value = { ...val };
  },
  { deep: true }
);

defineExpose({
  selectedValues,
  clearSelection
});
</script>

<template>
  <div :class="[ns.base.value, props.disabled ? 'is-disabled' : '']">
    <div
      v-for="dimension in props.dimensions"
      :key="dimension.name"
      :class="`${ns.base.value}__dimension`"
    >
      <div :class="`${ns.base.value}__dimension-header`">
        <slot name="dimension-label" :dimension="dimension">
          <span :class="`${ns.base.value}__dimension-name`">{{ dimension.name }}</span>
        </slot>
      </div>

      <div :class="`${ns.base.value}__options`">
        <button
          v-for="option in dimension.options"
          :key="option.value"
          type="button"
          :class="[
            `${ns.base.value}__option`,
            `${ns.base.value}__option--${dimension.type}`,
            {
              'is-selected': isOptionSelected(dimension.name, option.value),
              'is-disabled': getOptionDisabled(dimension.name, option.value),
              'is-unavailable': getOptionDisabled(dimension.name, option.value) && !option.disabled
            }
          ]"
          :disabled="getOptionDisabled(dimension.name, option.value)"
          :aria-pressed="isOptionSelected(dimension.name, option.value)"
          :title="option.label || option.value"
          @click="selectOption(dimension.name, option.value, getOptionDisabled(dimension.name, option.value))"
        >
          <slot
            name="option"
            :option="option"
            :active="isOptionSelected(dimension.name, option.value)"
            :disabled="getOptionDisabled(dimension.name, option.value)"
          >
            <template v-if="dimension.type === 'color'">
              <span
                :class="`${ns.base.value}__option-color`"
                :style="{ backgroundColor: option.color || '#ccc' }"
              />
              <span v-if="option.label" :class="`${ns.base.value}__option-label`">
                {{ option.label }}
              </span>
            </template>

            <template v-else-if="dimension.type === 'image'">
              <img
                v-if="option.image"
                :src="option.image"
                :alt="option.label || option.value"
                :class="`${ns.base.value}__option-image`"
              />
              <span v-else :class="`${ns.base.value}__option-placeholder`">
                {{ option.label || option.value }}
              </span>
            </template>

            <template v-else>
              <span :class="`${ns.base.value}__option-text`">
                {{ option.label || option.value }}
              </span>
            </template>

            <span
              v-if="isOptionSelected(dimension.name, option.value)"
              :class="`${ns.base.value}__option-check`"
            >
              ✓
            </span>
          </slot>
        </button>
      </div>
    </div>

    <div v-if="props.showStock" :class="`${ns.base.value}__stock`">
      <slot name="stock" :total-stock="totalStock" :available="availableStock">
        <span :class="[`${ns.base.value}__stock-text`, !availableStock ? 'is-unavailable' : '']">
          <template v-if="totalStock === Infinity">有货</template>
          <template v-else-if="totalStock > 0">库存: {{ totalStock }}</template>
          <template v-else>暂时无货</template>
        </span>
      </slot>
    </div>
  </div>
</template>
