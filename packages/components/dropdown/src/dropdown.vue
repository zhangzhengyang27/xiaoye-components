<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import type { StyleValue } from "vue";
import type { Placement } from "@floating-ui/dom";
import {
  useDismissibleLayer,
  useFloatingPanel,
  useFloatingVisibility,
  useListNavigation,
  useOverlayStack,
  useNamespace
} from "@xiaoye/composables";

export interface DropdownItem {
  key: string;
  label: string;
  disabled?: boolean;
  danger?: boolean;
  description?: string;
  command?: string | number | Record<string, unknown>;
}

export interface DropdownProps {
  modelValue?: boolean;
  items: DropdownItem[];
  placement?: Placement;
  disabled?: boolean;
  closeOnSelect?: boolean;
  role?: "menu" | "navigation";
  trigger?: "click" | "hover" | "contextmenu";
  openDelay?: number;
  closeDelay?: number;
  showAfter?: number;
  hideAfter?: number;
  maxHeight?: string | number;
  teleported?: boolean;
  appendTo?: string | HTMLElement;
  persistent?: boolean;
  popperClass?: string;
  popperStyle?: StyleValue;
}

const props = withDefaults(defineProps<DropdownProps>(), {
  modelValue: false,
  placement: "bottom-start",
  disabled: false,
  closeOnSelect: true,
  role: "menu",
  trigger: "hover",
  openDelay: 80,
  closeDelay: 120,
  showAfter: undefined,
  hideAfter: undefined,
  maxHeight: "",
  teleported: true,
  appendTo: "body",
  persistent: false,
  popperClass: "",
  popperStyle: undefined
});

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  select: [item: DropdownItem];
  command: [command: DropdownItem["command"] | DropdownItem["key"], item: DropdownItem];
  visibleChange: [value: boolean];
}>();

const ns = useNamespace("dropdown");
const triggerRef = ref<HTMLElement | null>(null);
const menuRef = ref<HTMLElement | null>(null);
const listId = `xy-dropdown-${Math.random().toString(36).slice(2, 10)}`;
const { zIndex, isTopMost, openLayer, closeLayer } = useOverlayStack();
const navigation = useListNavigation(() => props.items, { loop: true });
const itemRole = computed(() => props.role === "navigation" ? "link" : "menuitem");
const teleportTarget = computed(() => props.appendTo ?? "body");
const { visible, rendered, open: openFloating, close: closeFloating, toggle, clearTimers, handleAfterLeave } =
  useFloatingVisibility({
    modelValue: () => props.modelValue,
    disabled: () => props.disabled,
    persistent: () => props.persistent,
    openDelay: () => props.showAfter ?? props.openDelay,
    closeDelay: () => props.hideAfter ?? props.closeDelay,
    emitModelValue: (value) => {
      emit("update:modelValue", value);
    },
    onOpen: () => {
      emit("visibleChange", true);
      openLayer();
      navigation.activateFirst();
    },
    onClose: () => {
      emit("visibleChange", false);
      stopAutoUpdate();
      closeLayer();
    }
  });
const { floatingStyle, updatePosition, startAutoUpdate, stopAutoUpdate } = useFloatingPanel(
  triggerRef,
  menuRef,
  {
    placement: () => props.placement,
    strategy: "fixed",
    zIndex
  }
);
const menuMaxHeightStyle = computed(() => ({
  maxHeight:
    props.maxHeight === "" || props.maxHeight == null
      ? undefined
      : typeof props.maxHeight === "number"
        ? `${props.maxHeight}px`
        : props.maxHeight
}));

async function openMenu(immediate = props.trigger !== "hover") {
  openFloating({
    immediate
  });
}

function closeMenu(immediate = props.trigger !== "hover") {
  closeFloating({
    immediate
  });
}

function toggleMenu() {
  toggle();
}

function scheduleOpen() {
  if (props.trigger !== "hover") {
    return;
  }

  openFloating();
}

function scheduleClose() {
  if (props.trigger !== "hover") {
    return;
  }

  closeFloating();
}

function handleTriggerClick() {
  if (props.trigger !== "click") {
    return;
  }

  toggleMenu();
}

function handleContextMenu(event: MouseEvent) {
  if (props.trigger !== "contextmenu") {
    return;
  }

  event.preventDefault();

  if (visible.value) {
    closeMenu(true);
    return;
  }

  void openMenu(true);
}

function handleSelect(item: DropdownItem) {
  if (item.disabled) {
    return;
  }

  emit("select", item);
  emit("command", item.command ?? item.key, item);

  if (props.closeOnSelect) {
    closeFloating({
      immediate: true
    });
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
      if (!visible.value) {
        await openMenu(true);
      } else {
        navigation.moveNext();
        focusActiveItem();
      }
      break;
    case "ArrowUp":
      event.preventDefault();
      if (!visible.value) {
        await openMenu(true);
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
      if (!visible.value) {
        await openMenu(true);
        break;
      }

      if (navigation.activeItem.value) {
        handleSelect(navigation.activeItem.value);
      }
      break;
    case "Escape":
      closeFloating({
        immediate: true
      });
      triggerRef.value?.focus();
      break;
    case "Tab":
      closeFloating({
        immediate: true
      });
      if (event.shiftKey) {
        triggerRef.value?.focus();
      }
      break;
    default:
      break;
  }
}

watch(visible, async (value) => {
  stopAutoUpdate();

  if (!value) {
    return;
  }

  await nextTick();
  await updatePosition();
  startAutoUpdate();
  focusActiveItem();
});

useDismissibleLayer({
  enabled: () => visible.value,
  refs: [triggerRef, menuRef],
  closeOnEscape: true,
  closeOnOutside: true,
  isTopMost: () => isTopMost.value,
  onDismiss: () => {
    closeFloating({
      immediate: true
    });
  }
});

onBeforeUnmount(() => {
  clearTimers();
  stopAutoUpdate();
});
</script>

<template>
  <span :class="ns.base.value">
    <span
      ref="triggerRef"
      class="xy-dropdown__trigger"
      role="button"
      :tabindex="props.disabled ? -1 : 0"
      :aria-expanded="visible"
      :aria-controls="listId"
      :aria-haspopup="props.role === 'menu' ? 'menu' : undefined"
      @click="handleTriggerClick"
      @contextmenu="handleContextMenu"
      @mouseenter="scheduleOpen"
      @mouseleave="scheduleClose"
      @keydown="handleKeydown"
    >
      <slot>
        <button type="button" class="xy-dropdown__default-trigger">更多操作</button>
      </slot>
    </span>
    <teleport :to="teleportTarget" :disabled="!props.teleported">
      <transition name="xy-fade" @after-leave="handleAfterLeave">
        <div
          v-if="rendered"
          v-show="visible"
          :id="listId"
          ref="menuRef"
          :class="[ns.base.value + '__menu', props.popperClass]"
          :style="[floatingStyle, menuMaxHeightStyle, props.popperStyle]"
          :role="props.role"
          tabindex="-1"
          @mouseenter="scheduleOpen"
          @mouseleave="scheduleClose"
          @keydown="handleKeydown"
        >
          <button
            v-for="(item, index) in props.items"
            :key="item.key"
            :id="`${listId}-item-${index}`"
            :data-index="index"
            type="button"
            :role="itemRole"
            :tabindex="navigation.activeIndex.value === index ? 0 : -1"
            :disabled="item.disabled"
            :aria-disabled="item.disabled ? 'true' : undefined"
            :class="[
              'xy-dropdown__item',
              item.danger ? 'is-danger' : '',
              item.disabled ? 'is-disabled' : '',
              navigation.activeIndex.value === index ? 'is-active' : ''
            ]"
            @mouseenter="navigation.setActiveIndex(index)"
            @focus="navigation.setActiveIndex(index)"
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
