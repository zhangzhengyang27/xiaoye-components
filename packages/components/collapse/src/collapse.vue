<script setup lang="ts">
import { computed, provide, ref, watch } from "vue";
import { useNamespace } from "@xiaoye/composables";
import { collapseContextKey } from "./context";
import { ensureCollapseNames } from "./collapse";
import type { CollapseActiveName, CollapseModelValue } from "./context";
import type { CollapseProps } from "./collapse";

const props = withDefaults(defineProps<CollapseProps>(), {
  modelValue: () => [],
  accordion: false,
  expandIconPosition: "right",
  beforeCollapse: undefined
});

const emit = defineEmits<{
  "update:modelValue": [value: CollapseModelValue];
  change: [value: CollapseModelValue];
}>();

const ns = useNamespace("collapse");
const activeNames = ref<CollapseActiveName[]>(ensureCollapseNames(props.modelValue));
const accordion = computed(() => props.accordion);
const expandIconPosition = computed(() => props.expandIconPosition);
const rootClasses = computed(() => [
  ns.base.value,
  `${ns.base.value}--icon-${props.expandIconPosition}`
]);

function emitValue(names: CollapseActiveName[]) {
  const value = props.accordion ? (names[0] ?? "") : names;
  emit("update:modelValue", value);
  emit("change", value);
}

function setActiveNames(names: CollapseActiveName[]) {
  activeNames.value = names;
  emitValue(names);
}

async function canToggle(name: CollapseActiveName) {
  if (!props.beforeCollapse) {
    return true;
  }

  try {
    return (await props.beforeCollapse(name)) !== false;
  } catch {
    return false;
  }
}

async function toggleItem(name: CollapseActiveName) {
  const allowed = await canToggle(name);

  if (!allowed) {
    return;
  }

  if (props.accordion) {
    setActiveNames(activeNames.value[0] === name ? [] : [name]);
    return;
  }

  const nextNames = [...activeNames.value];
  const index = nextNames.indexOf(name);

  if (index >= 0) {
    nextNames.splice(index, 1);
  } else {
    nextNames.push(name);
  }

  setActiveNames(nextNames);
}

watch(
  () => props.modelValue,
  (value) => {
    activeNames.value = ensureCollapseNames(value);
  },
  {
    deep: true
  }
);

provide(collapseContextKey, {
  activeNames,
  accordion,
  expandIconPosition,
  toggleItem
});

defineExpose({
  activeNames,
  setActiveNames
});
</script>

<template>
  <div :class="rootClasses">
    <slot />
  </div>
</template>
