<script setup lang="ts">
defineOptions({
  name: "XyDropdownItem",
  inheritAttrs: false
});

import { computed, getCurrentInstance, onBeforeUnmount, onMounted, ref } from "vue";
import DropdownItemImpl from "./dropdown-item-impl.vue";
import type { DropdownItemProps } from "./dropdown-item";
import type { DropdownSelectItem } from "./dropdown";
import { useDropdown } from "./use-dropdown";

const props = withDefaults(defineProps<DropdownItemProps>(), {
  command: undefined,
  disabled: false,
  divided: false,
  icon: "",
  danger: false,
  description: "",
  textValue: ""
});

const slots = defineSlots<{
  default?: () => unknown;
  icon?: () => unknown;
  description?: () => unknown;
}>();

const dropdown = useDropdown();
const instance = getCurrentInstance();
const uid = instance?.uid ?? Math.random();
const itemRef = ref<InstanceType<typeof DropdownItemImpl> | null>(null);

const itemIndex = computed(() => dropdown?.getItemIndex(uid) ?? -1);
const active = computed(() => dropdown?.isItemActive(uid) ?? false);
const tabindex = computed(() => dropdown?.getItemTabIndex(uid) ?? -1);

function buildPayload(): DropdownSelectItem {
  const fallbackText = itemRef.value?.itemRef?.textContent?.trim() || undefined;

  return {
    command: props.command,
    disabled: props.disabled,
    divided: props.divided,
    icon: props.icon || undefined,
    danger: props.danger,
    description: props.description || undefined,
    textValue: props.textValue || fallbackText
  };
}

function handleSelect() {
  if (!dropdown || props.disabled) {
    return;
  }

  const payload = buildPayload();
  dropdown.commandHandler(payload.command ?? payload.textValue, payload);

  if (dropdown.hideOnClick.value) {
    dropdown.handleClose({
      restoreFocus: true,
      immediate: true
    });
  }
}

onMounted(() => {
  dropdown?.registerItem({
    uid,
    isDisabled: () => props.disabled,
    getTextValue: () => buildPayload().textValue,
    getEl: () => itemRef.value?.itemRef ?? null,
    select: handleSelect
  });
});

onBeforeUnmount(() => {
  dropdown?.unregisterItem(uid);
});
</script>

<template>
  <DropdownItemImpl
    :id="itemIndex >= 0 ? `${dropdown?.triggerId.value}-item-${itemIndex}` : undefined"
    ref="itemRef"
    :data-index="itemIndex >= 0 ? itemIndex : undefined"
    :role="dropdown?.itemRole.value ?? 'menuitem'"
    :active="active"
    :disabled="props.disabled"
    :divided="props.divided"
    :icon="props.icon"
    :danger="props.danger"
    :description="props.description"
    :text-value="props.textValue"
    :tabindex="tabindex"
    @click="handleSelect"
    @pointermove="dropdown?.handleItemPointerMove(uid)"
    @pointerleave="dropdown?.handleItemPointerLeave()"
    @focus="dropdown?.setActiveByUid(uid)"
  >
    <template v-if="slots.icon" #icon>
      <slot name="icon" />
    </template>

    <slot />

    <template v-if="slots.description" #description>
      <slot name="description" />
    </template>
  </DropdownItemImpl>
</template>
