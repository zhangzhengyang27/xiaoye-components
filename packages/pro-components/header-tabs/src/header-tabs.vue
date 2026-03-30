<script setup lang="ts">
import { computed } from "vue";
import { useNamespace } from "@xiaoye/composables";
import { XyDropdown, XyIcon, XyTabs } from "@xiaoye/components";
import type { HeaderTabsMenuAction, HeaderTabsProps } from "./header-tabs";

defineOptions({
  name: "XyHeaderTabs"
});

const props = withDefaults(defineProps<HeaderTabsProps>(), {
  modelValue: undefined,
  defaultValue: undefined,
  items: () => [],
  type: "card",
  tabPosition: "top",
  closable: true,
  addable: false,
  editable: false,
  beforeLeave: undefined,
  menuActions: () => [
    { key: "close-current", label: "关闭当前" },
    { key: "close-others", label: "关闭其他" },
    { key: "close-left", label: "关闭左侧" },
    { key: "close-right", label: "关闭右侧" },
    { key: "close-all", label: "关闭全部" }
  ]
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
  change: [value: string];
  edit: [key: string | undefined, action: "remove" | "add"];
  tabRemove: [key: string];
  tabAdd: [];
  tabMenuClick: [action: HeaderTabsMenuAction];
}>();

const ns = useNamespace("header-tabs");
const dropdownItems = computed(() =>
  props.menuActions.map((item) => ({
    key: item.key,
    label: item.label,
    command: item.key
  }))
);

function handleMenuCommand(command: HeaderTabsMenuAction) {
  emit("tabMenuClick", command);
}

function handleTabsEdit(key: string | undefined, action: "remove" | "add") {
  emit("edit", key, action);
}

function handleModelValueUpdate(value: string) {
  emit("update:modelValue", value);
}

function handleChange(value: string) {
  emit("change", value);
}

function handleTabRemove(key: string) {
  emit("tabRemove", key);
}

function handleTabAdd() {
  emit("tabAdd");
}

function handleDropdownCommand(command: unknown) {
  if (typeof command !== "string") {
    return;
  }

  handleMenuCommand(command as HeaderTabsMenuAction);
}
</script>

<template>
  <div :class="ns.base.value">
    <xy-tabs
      class="xy-header-tabs__tabs"
      :model-value="props.modelValue"
      :default-value="props.defaultValue"
      :items="props.items"
      :type="props.type"
      :tab-position="props.tabPosition"
      :closable="props.closable"
      :addable="props.addable"
      :editable="props.editable"
      :before-leave="props.beforeLeave"
      @update:model-value="handleModelValueUpdate"
      @change="handleChange"
      @edit="handleTabsEdit"
      @tab-remove="handleTabRemove"
      @tab-add="handleTabAdd"
    />

    <xy-dropdown
      class="xy-header-tabs__menu"
      trigger="click"
      :items="dropdownItems"
      @command="handleDropdownCommand"
    >
      <button type="button" class="xy-header-tabs__menu-trigger" aria-label="tab actions">
        <xy-icon icon="mdi:dots-horizontal" />
      </button>
    </xy-dropdown>
  </div>
</template>
