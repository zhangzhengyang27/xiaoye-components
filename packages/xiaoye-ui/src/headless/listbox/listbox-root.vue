<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, provide, ref, watch } from "vue";
import { useFloatingPanel, useListNavigation, useZIndex } from "xiaoye-primitives";
import type { ListboxOptionData, ListboxRootProps } from "./listbox-context";
export type { ListboxOptionData, ListboxRootProps };

const props = withDefaults(defineProps<ListboxRootProps>(), {
  modelValue: null,
  options: () => [],
  disabled: false,
  placement: "bottom-start",
  offset: 8
});

const emit = defineEmits<{
  "update:modelValue": [value: typeof props.modelValue];
  change: [value: typeof props.modelValue];
}>();

const slots = defineSlots<{
  default?: () => unknown;
}>();

const isOpen = ref(false);
const buttonRef = ref<HTMLElement | null>(null);
const listRef = ref<HTMLElement | null>(null);
const { zIndex, onNextZIndex } = useZIndex();

const flatOptions = computed(() =>
  props.options.map((opt, idx) => ({ ...opt, _index: idx }))
);

const navigation = useListNavigation(flatOptions, {
  loop: true,
  disabled: computed(() => !isOpen.value || props.disabled)
});

const { actualPlacement, floatingStyle, updatePosition } = useFloatingPanel(buttonRef, listRef, {
  placement: computed(() => props.placement),
  offset: computed(() => props.offset),
  zIndex
});

const activeOption = computed(() => navigation.activeItem.value);

const selectedValue = computed(() => {
  if (props.modelValue === null || props.modelValue === undefined) return null;
  if (typeof props.modelValue === "object" && "value" in props.modelValue) {
    return props.modelValue.value;
  }
  return props.modelValue;
});

const selectedOption = computed(() =>
  flatOptions.value.find((opt) => opt.value === selectedValue.value) || null
);

function open() {
  if (props.disabled) return;
  isOpen.value = true;
  zIndex.value = onNextZIndex();
  updatePosition();
}

function close() {
  isOpen.value = false;
}

function toggle() {
  if (isOpen.value) {
    close();
  } else {
    open();
  }
}

async function selectOption(option: ListboxOptionData) {
  if (option.disabled) return;

  const newValue = option as typeof props.modelValue;
  emit("update:modelValue", newValue);
  emit("change", newValue);
  close();
}

watch(isOpen, (value) => {
  if (value) {
    updatePosition();
  }
});

function handleKeydown(event: KeyboardEvent) {
  if (props.disabled) return;

  switch (event.key) {
    case "Enter":
    case " ":
      event.preventDefault();
      if (activeOption.value && !activeOption.value.disabled) {
        selectOption(activeOption.value);
      }
      break;
    case "Escape":
      event.preventDefault();
      close();
      buttonRef.value?.focus();
      break;
  }
}

const context = {
  isOpen,
  buttonRef,
  listRef,
  zIndex,
  actualPlacement,
  floatingStyle,
  activeOption,
  selectedOption,
  selectedValue,
  navigation,
  open,
  close,
  toggle,
  selectOption,
  updatePosition
};

provide("xy-listbox-context", context);

defineExpose({
  open,
  close,
  toggle
});
</script>

<template>
  <div class="xy-listbox-root">
    <slot />
  </div>
</template>
