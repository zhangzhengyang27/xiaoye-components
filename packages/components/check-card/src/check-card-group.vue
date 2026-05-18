<script setup lang="ts">
import { useSlots } from "vue";
import { useNamespace } from "@xiaoye/primitives";
import XyCheckCard from "./check-card.vue";
import type { CheckCardGroupOption, CheckCardGroupProps, CheckCardValue } from "./check-card-group";

defineOptions({
  name: "XyCheckCardGroup"
});

const props = withDefaults(defineProps<CheckCardGroupProps>(), {
  modelValue: undefined,
  options: () => [],
  size: undefined,
  disabled: false,
  multiple: false,
  ariaLabel: undefined
});

const emit = defineEmits<{
  "update:modelValue": [value: CheckCardValue | null | CheckCardValue[]];
  change: [value: CheckCardValue | null | CheckCardValue[]];
  extra: [option: CheckCardGroupOption];
}>();

const slots: ReturnType<typeof useSlots> = useSlots();
const ns = useNamespace("check-card-group");

function hasSlot(prefix: string, value: CheckCardValue) {
  return Boolean(slots[`${prefix}-${String(value)}`] || slots[prefix]);
}

function resolveSlotName(prefix: string, value: CheckCardValue) {
  const specific = `${prefix}-${String(value)}`;
  return slots[specific] ? specific : prefix;
}

function getChecked(value: CheckCardValue) {
  if (props.multiple) {
    return Array.isArray(props.modelValue) ? props.modelValue.includes(value) : false;
  }

  return props.modelValue === value;
}

function updateValue(nextValue: CheckCardValue | null | CheckCardValue[]) {
  emit("update:modelValue", nextValue);
  emit("change", nextValue);
}

function handleChange(checked: boolean, value: CheckCardValue) {
  if (props.multiple) {
    const current = Array.isArray(props.modelValue) ? props.modelValue : [];

    if (checked) {
      updateValue(current.includes(value) ? current.slice() : [...current, value]);
      return;
    }

    updateValue(current.filter((item) => item !== value));
    return;
  }

  updateValue(checked ? value : null);
}

function handleExtra(option: CheckCardGroupOption) {
  if (props.disabled || option.disabled) {
    return;
  }

  emit("extra", option);
}
</script>

<template>
  <div
    :class="ns.base.value"
    role="group"
    :aria-label="props.ariaLabel || 'check-card-group'"
  >
    <XyCheckCard
      v-for="option in props.options"
      :key="String(option.value)"
      :model-value="getChecked(option.value)"
      :size="option.size ?? props.size"
      :disabled="props.disabled || option.disabled"
      :title="option.title"
      :description="option.description"
      :extra="option.extra"
      :avatar="option.avatar"
      :tag="option.tag"
      :aria-label="String(option.title || option.value)"
      @change="handleChange($event, option.value)"
      @extra="handleExtra(option)"
    >
      <template
        v-if="hasSlot('avatar', option.value)"
        #avatar="slotScope"
      >
        <slot
          :name="resolveSlotName('avatar', option.value)"
          v-bind="{ ...slotScope, option }"
        />
      </template>

      <template
        v-if="hasSlot('title', option.value)"
        #title="slotScope"
      >
        <slot
          :name="resolveSlotName('title', option.value)"
          v-bind="{ ...slotScope, option }"
        />
      </template>

      <template
        v-if="hasSlot('tag', option.value)"
        #tag="slotScope"
      >
        <slot
          :name="resolveSlotName('tag', option.value)"
          v-bind="{ ...slotScope, option }"
        />
      </template>

      <template
        v-if="hasSlot('description', option.value)"
        #description="slotScope"
      >
        <slot
          :name="resolveSlotName('description', option.value)"
          v-bind="{ ...slotScope, option }"
        />
      </template>

      <template
        v-if="hasSlot('extra', option.value)"
        #extra="slotScope"
      >
        <slot
          :name="resolveSlotName('extra', option.value)"
          v-bind="{ ...slotScope, option }"
        />
      </template>
    </XyCheckCard>
  </div>
</template>
