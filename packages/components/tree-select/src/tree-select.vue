<script setup lang="ts">
import { computed, inject, nextTick, ref, watch } from "vue";
import type { StyleValue } from "vue";
import {
  useConfig,
  useDismissibleLayer,
  useFloatingPanel,
  useNamespace,
  useOverlayStack
} from "@xiaoye/composables";
import XyIcon from "../../icon";
import XyInput from "../../input";
import XyTree from "../../tree";
import type { TreeInstance } from "../../tree";
import type { FilterValue, TreeNodeData, TreeOptionProps } from "../../tree/src/tree.type";
import { formItemKey } from "../../form/src/context";
import type { TreeSelectProps } from "./tree-select";

const props = withDefaults(defineProps<TreeSelectProps>(), {
  modelValue: null,
  data: () => [],
  nodeKey: undefined,
  props: (): TreeOptionProps => ({
    children: "children",
    label: "label",
    disabled: "disabled"
  }),
  placeholder: "请选择节点",
  disabled: false,
  clearable: false,
  filterable: false,
  filterNodeMethod: undefined,
  lazy: false,
  load: undefined,
  size: undefined,
  emptyText: "暂无数据",
  searchPlaceholder: "搜索节点",
  teleported: true,
  appendTo: "body",
  placement: "bottom-start",
  offset: 8,
  popperClass: "",
  popperStyle: ""
});

const emit = defineEmits<{
  "update:modelValue": [value: string | number | null];
  change: [value: string | number | null];
  clear: [];
  visibleChange: [value: boolean];
  focus: [];
  blur: [];
}>();

const formItem = inject(formItemKey, null);
const ns = useNamespace("tree-select");
const { size: globalSize } = useConfig();
const mergedSize = computed(() => props.size ?? globalSize.value);
const mergedDisabled = computed(() => props.disabled || Boolean(formItem?.disabled.value));
const triggerRef = ref<HTMLElement | null>(null);
const dropdownRef = ref<HTMLElement | null>(null);
const dropdownArrowRef = ref<HTMLElement | null>(null);
const treeRef = ref<TreeInstance | null>(null);
const open = ref(false);
const searchValue = ref("");
const selectedValue = ref<string | number | null>(props.modelValue);
const { zIndex, isTopMost, openLayer, closeLayer } = useOverlayStack();

const {
  actualPlacement,
  arrowStyle,
  floatingStyle,
  updatePosition,
  startAutoUpdate,
  stopAutoUpdate
} = useFloatingPanel(triggerRef, dropdownRef, {
  arrowRef: dropdownArrowRef,
  placement: computed(() => props.placement),
  offset: computed(() => props.offset),
  matchTriggerWidth: true,
  zIndex
});

function getChildrenField() {
  return props.props.children ?? "children";
}

function resolveNodeKey(data: TreeNodeData) {
  if (!props.nodeKey) {
    return null;
  }

  const value = data?.[props.nodeKey];
  return typeof value === "string" || typeof value === "number" ? value : null;
}

function resolveNodeLabel(data: TreeNodeData) {
  const labelProp = props.props.label ?? "label";

  if (typeof labelProp === "function") {
    return `${labelProp(data, null as never) ?? ""}`;
  }

  return `${data?.[labelProp] ?? ""}`;
}

function resolveNodeDisabled(data: TreeNodeData) {
  const disabledProp = props.props.disabled ?? "disabled";

  if (typeof disabledProp === "function") {
    return Boolean(disabledProp(data, null as never));
  }

  return Boolean(data?.[disabledProp]);
}

function findNodeLabel(data: TreeNodeData[], key: string | number | null): string {
  if (key == null) {
    return "";
  }

  const childrenField = getChildrenField();

  for (const item of data) {
    if (resolveNodeKey(item) === key) {
      return resolveNodeLabel(item);
    }

    const children = Array.isArray(item?.[childrenField]) ? (item[childrenField] as TreeNodeData[]) : [];
    const childLabel = findNodeLabel(children, key);

    if (childLabel) {
      return childLabel;
    }
  }

  return "";
}

const displayLabel = computed(() => {
  const label = findNodeLabel(props.data, selectedValue.value);
  return label || props.placeholder;
});

const showClear = computed(
  () => props.clearable && selectedValue.value !== null && selectedValue.value !== undefined && !mergedDisabled.value
);

const dropdownStyle = computed<StyleValue>(() => [floatingStyle.value, props.popperStyle]);

function defaultFilterNodeMethod(value: FilterValue, data: TreeNodeData) {
  if (!value) {
    return true;
  }

  return resolveNodeLabel(data).toLowerCase().includes(`${value}`.trim().toLowerCase());
}

const resolvedFilterMethod = computed(
  () => props.filterNodeMethod ?? ((value: FilterValue, data: TreeNodeData) => defaultFilterNodeMethod(value, data))
);

async function openDropdown() {
  if (mergedDisabled.value || open.value) {
    return;
  }

  open.value = true;
  emit("visibleChange", true);
  emit("focus");
  openLayer();

  await nextTick();
  treeRef.value?.setCurrentKey(selectedValue.value ?? undefined);
  if (props.filterable) {
    treeRef.value?.filter(searchValue.value);
  }
  await updatePosition();
  startAutoUpdate();
}

async function closeDropdown(shouldValidate = false, restoreFocus = false) {
  if (!open.value) {
    return;
  }

  open.value = false;
  emit("visibleChange", false);
  emit("blur");
  stopAutoUpdate();
  closeLayer();

  if (restoreFocus) {
    await nextTick();
    triggerRef.value?.focus();
  }

  if (shouldValidate) {
    await formItem?.validate("blur");
  }
}

async function selectNode(data: TreeNodeData) {
  if (resolveNodeDisabled(data)) {
    return;
  }

  const nextValue = resolveNodeKey(data);

  if (nextValue == null) {
    return;
  }

  selectedValue.value = nextValue;
  emit("update:modelValue", nextValue);
  emit("change", nextValue);
  await closeDropdown(false, true);
  await formItem?.validate("change");
}

async function clearValue(event: MouseEvent) {
  event.preventDefault();
  event.stopPropagation();

  selectedValue.value = null;
  emit("update:modelValue", null);
  emit("change", null);
  emit("clear");
  await formItem?.validate("change");
}

async function handleTriggerKeydown(event: KeyboardEvent) {
  if (mergedDisabled.value) {
    return;
  }

  switch (event.key) {
    case "ArrowDown":
    case "Enter":
    case " ":
      event.preventDefault();
      await openDropdown();
      break;
    case "Escape":
      event.preventDefault();
      await closeDropdown(true, true);
      break;
    default:
      break;
  }
}

function focus() {
  triggerRef.value?.focus();
}

async function blur() {
  triggerRef.value?.blur();
  await closeDropdown(true);
}

function filter(value: string) {
  searchValue.value = value;
  treeRef.value?.filter(value);
}

watch(
  () => props.modelValue,
  (value) => {
    selectedValue.value = value;
  }
);

watch(searchValue, async (value) => {
  if (!props.filterable) {
    return;
  }

  treeRef.value?.filter(value);
  await nextTick();
  await updatePosition();
});

useDismissibleLayer({
  enabled: open,
  refs: [triggerRef, dropdownRef],
  closeOnEscape: true,
  closeOnOutside: true,
  isTopMost: () => isTopMost.value,
  onDismiss: async (reason) => {
    await closeDropdown(reason === "outside", reason === "escape");
  }
});

defineExpose({
  focus,
  blur,
  open: openDropdown,
  close: closeDropdown,
  filter
});
</script>

<template>
  <div
    :class="[
      ns.base.value,
      `${ns.base.value}--${mergedSize}`,
      open ? 'is-open' : '',
      mergedDisabled ? 'is-disabled' : '',
      formItem?.validateState.value === 'error' ? 'is-error' : ''
    ]"
  >
    <div
      ref="triggerRef"
      class="xy-tree-select__trigger"
      role="combobox"
      tabindex="0"
      :aria-disabled="mergedDisabled"
      :aria-expanded="open"
      :aria-describedby="formItem?.message.value ? formItem.messageId : undefined"
      :aria-invalid="formItem?.validateState.value === 'error'"
      @click="openDropdown"
      @keydown="handleTriggerKeydown"
    >
      <span :class="['xy-tree-select__label', !selectedValue ? 'is-placeholder' : '']">
        {{ displayLabel }}
      </span>
      <button
        v-if="showClear"
        type="button"
        class="xy-tree-select__icon-button xy-tree-select__clear"
        @click="clearValue"
      >
        <XyIcon icon="mdi:close-circle" />
      </button>
      <span class="xy-tree-select__icon">
        <XyIcon icon="mdi:chevron-down" />
      </span>
    </div>

    <teleport :to="props.appendTo" :disabled="!props.teleported">
      <transition name="xy-fade">
        <div
          v-if="open"
          ref="dropdownRef"
          :class="['xy-tree-select__dropdown', props.popperClass]"
          :style="dropdownStyle"
          :data-placement="actualPlacement"
        >
          <span ref="dropdownArrowRef" class="xy-popper__arrow" :style="arrowStyle" />

          <div v-if="props.filterable" class="xy-tree-select__search">
            <xy-input
              :model-value="searchValue"
              size="sm"
              clearable
              :placeholder="props.searchPlaceholder"
              :validate-event="false"
              @update:model-value="filter(String($event ?? ''))"
            />
          </div>

          <xy-tree
            ref="treeRef"
            class="xy-tree-select__tree"
            :data="props.data"
            :node-key="props.nodeKey"
            :props="props.props"
            :empty-text="props.emptyText"
            :lazy="props.lazy"
            :load="props.load"
            :highlight-current="true"
            :current-node-key="selectedValue ?? undefined"
            :filter-node-method="resolvedFilterMethod"
            @node-click="selectNode"
          />
        </div>
      </transition>
    </teleport>
  </div>
</template>
