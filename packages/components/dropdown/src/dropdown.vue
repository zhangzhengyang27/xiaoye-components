<script setup lang="ts">
import { nextTick, ref, watch } from "vue";
import type { Placement } from "@floating-ui/dom";
import { useDismissibleLayer, useFloatingPanel, useListNavigation, useOverlayStack, useNamespace } from "@xiaoye/composables";

export interface DropdownItem {
  key: string;
  label: string;
  disabled?: boolean;
  danger?: boolean;
  description?: string;
}

export interface DropdownProps {
  items: DropdownItem[];
  placement?: Placement;
  disabled?: boolean;
  closeOnSelect?: boolean;
}

const props = withDefaults(defineProps<DropdownProps>(), {
  placement: "bottom-start",
  disabled: false,
  closeOnSelect: true
});

const emit = defineEmits<{
  select: [item: DropdownItem];
  visibleChange: [value: boolean];
}>();

const ns = useNamespace("dropdown");
const triggerRef = ref<HTMLElement | null>(null);
const menuRef = ref<HTMLElement | null>(null);
const open = ref(false);
const listId = `xy-dropdown-${Math.random().toString(36).slice(2, 10)}`;
const { zIndex, isTopMost, openLayer, closeLayer } = useOverlayStack();
const navigation = useListNavigation(() => props.items, { loop: true });
const { floatingStyle, updatePosition, startAutoUpdate, stopAutoUpdate } = useFloatingPanel(
  triggerRef,
  menuRef,
  {
    placement: props.placement,
    zIndex
  }
);

async function openMenu() {
  if (props.disabled || open.value) {
    return;
  }

  open.value = true;
  emit("visibleChange", true);
  openLayer();
  navigation.activateFirst();
  await nextTick();
  await updatePosition();
  startAutoUpdate();
}

function closeMenu() {
  if (!open.value) {
    return;
  }

  open.value = false;
  emit("visibleChange", false);
  stopAutoUpdate();
  closeLayer();
}

function toggleMenu() {
  if (open.value) {
    closeMenu();
    return;
  }

  void openMenu();
}

function handleSelect(item: DropdownItem) {
  if (item.disabled) {
    return;
  }

  emit("select", item);

  if (props.closeOnSelect) {
    closeMenu();
    triggerRef.value?.focus();
  }
}

function focusActiveItem() {
  if (navigation.activeIndex.value < 0) {
    return;
  }

  const activeElement = menuRef.value?.querySelector<HTMLElement>(
    `[data-index="${navigation.activeIndex.value}"]`
  );
  activeElement?.focus();
}

async function handleKeydown(event: KeyboardEvent) {
  if (props.disabled) {
    return;
  }

  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      if (!open.value) {
        await openMenu();
      } else {
        navigation.moveNext();
        focusActiveItem();
      }
      break;
    case "ArrowUp":
      event.preventDefault();
      if (!open.value) {
        await openMenu();
      } else {
        navigation.movePrev();
        focusActiveItem();
      }
      break;
    case "Home":
      event.preventDefault();
      navigation.activateFirst();
      focusActiveItem();
      break;
    case "End":
      event.preventDefault();
      navigation.activateLast();
      focusActiveItem();
      break;
    case "Enter":
    case " ":
      event.preventDefault();
      if (!open.value) {
        await openMenu();
        break;
      }

      if (navigation.activeItem.value) {
        handleSelect(navigation.activeItem.value);
      }
      break;
    case "Escape":
      closeMenu();
      triggerRef.value?.focus();
      break;
    default:
      break;
  }
}

watch(open, async (value) => {
  if (!value) {
    return;
  }

  await nextTick();
  focusActiveItem();
});

useDismissibleLayer({
  enabled: open,
  refs: [triggerRef, menuRef],
  closeOnEscape: true,
  closeOnOutside: true,
  isTopMost: () => isTopMost.value,
  onDismiss: () => {
    closeMenu();
  }
});
</script>

<template>
  <span :class="ns.base.value">
    <span
      ref="triggerRef"
      class="xy-dropdown__trigger"
      role="button"
      :tabindex="props.disabled ? -1 : 0"
      :aria-expanded="open"
      :aria-controls="listId"
      @click="toggleMenu"
      @keydown="handleKeydown"
    >
      <slot>
        <button type="button" class="xy-dropdown__default-trigger">更多操作</button>
      </slot>
    </span>
    <teleport to="body">
      <transition name="xy-fade">
        <div
          v-if="open"
          :id="listId"
          ref="menuRef"
          :class="ns.base.value + '__menu'"
          :style="floatingStyle"
          role="menu"
        >
          <button
            v-for="(item, index) in props.items"
            :key="item.key"
            :data-index="index"
            type="button"
            role="menuitem"
            :disabled="item.disabled"
            :class="[
              'xy-dropdown__item',
              item.danger ? 'is-danger' : '',
              item.disabled ? 'is-disabled' : '',
              navigation.activeIndex.value === index ? 'is-active' : ''
            ]"
            @mouseenter="navigation.setActiveIndex(index)"
            @click="handleSelect(item)"
          >
            <span>{{ item.label }}</span>
            <small v-if="item.description">{{ item.description }}</small>
          </button>
        </div>
      </transition>
    </teleport>
  </span>
</template>
