<script setup lang="ts">
import { Fragment, computed, inject, isVNode, nextTick, provide, toRef, useSlots } from "vue";
import type { VNode, VNodeArrayChildren } from "vue";
import { useConfig, useNamespace } from "@xiaoye/composables";
import { formItemKey } from "../../form/src/context";
import XyRadio from "./radio.vue";
import XyRadioButton from "./radio-button.vue";
import { radioGroupContextKey } from "./context";
import type { RadioValue } from "./radio";
import type { RadioGroupProps } from "./radio-group";

const props = withDefaults(defineProps<RadioGroupProps>(), {
  options: () => [],
  type: "radio",
  disabled: false,
  size: undefined,
  name: undefined,
  direction: "horizontal",
  validateEvent: true,
  ariaLabel: undefined,
  fill: undefined,
  textColor: undefined
});

const emit = defineEmits<{
  "update:modelValue": [value: RadioValue];
  change: [value: RadioValue];
}>();

const slots = useSlots();
const ns = useNamespace("radio");
const { size: globalSize } = useConfig();
const formItem = inject(formItemKey, null);
const fallbackName = `xy-radio-${Math.random().toString(36).slice(2, 10)}`;

const mergedSize = computed(() => props.size ?? globalSize.value);
const groupName = computed(() => props.name ?? fallbackName);
const optionComponent = computed(() => (props.type === "button" ? XyRadioButton : XyRadio));

function flattenChildren(children?: VNodeArrayChildren) {
  const queue: VNode[] = [];

  (children ?? []).forEach((child) => {
    if (isVNode(child)) {
      queue.push(child);
    }
  });

  return queue;
}

const isButtonGroup = computed(() => {
  if (props.type === "button") {
    return true;
  }

  const queue = flattenChildren(slots.default?.());

  while (queue.length) {
    const vnode = queue.shift();
    if (!vnode) {
      continue;
    }

    if (vnode.type === XyRadioButton) {
      return true;
    }

    if (vnode.type === Fragment && Array.isArray(vnode.children)) {
      vnode.children.forEach((child: VNodeArrayChildren[number]) => {
        if (isVNode(child)) {
          queue.push(child);
        }
      });
    }
  }

  return false;
});
const groupClasses = computed(() => [
  `${ns.base.value}-group`,
  `${ns.base.value}-group--${props.direction}`,
  isButtonGroup.value ? `${ns.base.value}-group--button` : ""
]);
const groupStyles = computed(() => ({
  "--xy-radio-button-fill": props.fill,
  "--xy-radio-button-text-color": props.textColor
}));

async function changeValue(value: RadioValue) {
  if (props.disabled || props.modelValue === value) {
    return;
  }

  emit("update:modelValue", value);
  await nextTick();
  emit("change", value);

  if (props.validateEvent) {
    await formItem?.validate("change");
  }
}

provide(radioGroupContextKey, {
  modelValue: toRef(props, "modelValue"),
  disabled: toRef(props, "disabled"),
  size: mergedSize,
  name: groupName,
  fill: toRef(props, "fill"),
  textColor: toRef(props, "textColor"),
  changeValue
});
</script>

<template>
  <div
    :class="groupClasses"
    :style="groupStyles"
    role="radiogroup"
    :aria-label="props.ariaLabel ?? 'radio-group'"
    :aria-orientation="props.direction"
  >
    <slot>
      <component
        :is="optionComponent"
        v-for="option in props.options"
        :key="String(option.value)"
        :value="option.value"
        :disabled="option.disabled"
      >
        <span
          :class="[
            `${ns.base.value}-group__option`,
            option.description ? 'has-description' : ''
          ]"
        >
          <span :class="`${ns.base.value}-group__option-label`">{{ option.label }}</span>
          <span
            v-if="option.description"
            :class="`${ns.base.value}-group__option-description`"
          >
            {{ option.description }}
          </span>
        </span>
      </component>
    </slot>
  </div>
</template>
