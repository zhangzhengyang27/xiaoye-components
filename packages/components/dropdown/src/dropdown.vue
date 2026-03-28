<script setup lang="ts">
defineOptions({
  name: "XyDropdown",
  inheritAttrs: false
});

import { computed, nextTick, onBeforeUnmount, provide, ref, useAttrs, watch } from "vue";
import type { Ref, StyleValue } from "vue";
import type { ReferenceElement } from "@floating-ui/dom";
import {
  useDismissibleLayer,
  useFloatingPanel,
  useFloatingVisibility,
  useListNavigation,
  useOverlayStack,
  useNamespace
} from "@xiaoye/composables";
import XyButton from "../../button";
import { XyButtonGroup } from "../../button";
import XyIcon from "../../icon";
import XyDropdownItemImpl from "./dropdown-item-impl.vue";
import XyDropdownMenu from "./dropdown-menu.vue";
import type {
  DropdownCommand,
  DropdownItem,
  DropdownPopperOptions,
  DropdownProps,
  DropdownRole,
  DropdownSelectItem,
  DropdownTrigger
} from "./dropdown";
import { dropdownContextKey, type DropdownRegisteredItem } from "./tokens";

const props = withDefaults(defineProps<DropdownProps>(), {
  modelValue: false,
  items: () => [],
  placement: "bottom-start",
  disabled: false,
  hideOnClick: undefined,
  closeOnSelect: true,
  role: "menu",
  trigger: "hover",
  triggerKeys: () => ["Enter", "NumpadEnter", " ", "ArrowDown"],
  openDelay: 80,
  closeDelay: 120,
  showAfter: undefined,
  hideAfter: undefined,
  maxHeight: "",
  teleported: true,
  appendTo: "body",
  persistent: false,
  popperClass: "",
  popperStyle: undefined,
  showArrow: true,
  virtualRef: null,
  virtualTriggering: false,
  splitButton: false,
  buttonProps: undefined,
  tabindex: 0,
  loop: true,
  popperOptions: () => ({})
});

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  select: [item: DropdownSelectItem | DropdownItem];
  command: [command: DropdownCommand | string | undefined, item: DropdownSelectItem | DropdownItem];
  visibleChange: [value: boolean];
  click: [event: MouseEvent];
}>();

const slots = defineSlots<{
  default?: () => unknown;
  dropdown?: () => unknown;
}>();
const attrs = useAttrs();
const ns = useNamespace("dropdown");
const triggerRef = ref<HTMLElement | null>(null);
const mainButtonRef = ref<HTMLElement | null>(null);
const caretButtonRef = ref<HTMLElement | null>(null);
const menuRef = ref<HTMLElement | null>(null);
const arrowRef = ref<HTMLElement | null>(null);
const registeredItems = ref<DropdownRegisteredItem[]>([]);
const isUsingKeyboard = ref(false);
const shouldFocusAfterOpen = ref(false);
const restoreFocusAfterClose = ref(false);
const internalVirtualRef = ref<ReferenceElement | null>(null);
const listId = `xy-dropdown-${Math.random().toString(36).slice(2, 10)}`;

const { zIndex, isTopMost, openLayer, closeLayer } = useOverlayStack();
const normalizedTriggers = computed<DropdownTrigger[]>(() =>
  Array.isArray(props.trigger) ? props.trigger : [props.trigger]
);
const isLegacyMode = computed(() => !slots.dropdown && props.items.length > 0);
const hasMenuContent = computed(() => isLegacyMode.value || Boolean(slots.dropdown));
const itemRole = computed<"menuitem" | "link">(() => (props.role === "navigation" ? "link" : "menuitem"));
const teleportTarget = computed(() => props.appendTo ?? "body");
const hideOnClick = computed(() => props.hideOnClick ?? props.closeOnSelect);
const triggerId = computed(() => listId);
const normalizedPopperOptions = computed<Required<DropdownPopperOptions>>(() => ({
  offset: props.popperOptions?.offset ?? 10,
  strategy: props.popperOptions?.strategy ?? "fixed",
  arrowPadding: props.popperOptions?.arrowPadding ?? 8,
  matchTriggerWidth: props.popperOptions?.matchTriggerWidth ?? false,
  shiftPadding: props.popperOptions?.shiftPadding ?? 8,
  flip: props.popperOptions?.flip ?? true
}));
const menuStyle = computed<StyleValue>(() => ({
  maxHeight:
    props.maxHeight === "" || props.maxHeight == null
      ? undefined
      : typeof props.maxHeight === "number"
        ? `${props.maxHeight}px`
        : props.maxHeight
}));
const rootClasses = computed(() => [
  ns.base.value,
  props.disabled ? "is-disabled" : "",
  props.splitButton ? "is-split-button" : "",
  attrs.class
]);
const mainButtonProps = computed(() => ({
  ...props.buttonProps,
  disabled: props.disabled || props.buttonProps?.disabled
}));
const fallbackTriggerText = computed(() => (props.splitButton ? "更多操作" : "更多操作"));
const triggerKeysSet = computed(() => new Set(props.triggerKeys));

const referenceRef = computed<ReferenceElement | null>(() => {
  if (props.virtualTriggering && props.virtualRef) {
    return props.virtualRef;
  }

  if (internalVirtualRef.value) {
    return internalVirtualRef.value;
  }

  if (props.splitButton) {
    return caretButtonRef.value;
  }

  return triggerRef.value;
});

const navigationItems = computed(() =>
  isLegacyMode.value
    ? props.items.map((item) => ({
        disabled: item.disabled
      }))
    : registeredItems.value.map((item) => ({
        disabled: item.isDisabled()
      }))
);

const navigation = useListNavigation(() => navigationItems.value, {
  loop: props.loop
});

const activeRegisteredItem = computed(
  () => (!isLegacyMode.value ? registeredItems.value[navigation.activeIndex.value] ?? null : null)
);

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
    },
    onClose: () => {
      emit("visibleChange", false);
      stopAutoUpdate();
      closeLayer();
      navigation.clearActiveIndex();
      internalVirtualRef.value = null;

      if (restoreFocusAfterClose.value) {
        focusTrigger();
        restoreFocusAfterClose.value = false;
      }
    }
  });

const { actualPlacement, arrowStyle, floatingStyle, updatePosition, startAutoUpdate, stopAutoUpdate } =
  useFloatingPanel(referenceRef as Ref<ReferenceElement | null>, menuRef, {
    placement: () => props.placement,
    strategy: () => normalizedPopperOptions.value.strategy,
    offset: () => normalizedPopperOptions.value.offset,
    matchTriggerWidth: () => normalizedPopperOptions.value.matchTriggerWidth,
    arrowRef: props.showArrow ? arrowRef : undefined,
    arrowPadding: normalizedPopperOptions.value.arrowPadding,
    shiftPadding: () => normalizedPopperOptions.value.shiftPadding,
    flip: () => normalizedPopperOptions.value.flip,
    zIndex
  });

function focusTrigger() {
  const target = props.splitButton ? caretButtonRef.value : triggerRef.value;
  target?.focus();
}

function isTriggerEnabled(trigger: DropdownTrigger) {
  return normalizedTriggers.value.includes(trigger);
}

function syncNavigationOnOpen() {
  const currentItems = navigationItems.value;

  if (!currentItems.length) {
    navigation.clearActiveIndex();
    return;
  }

  const active = currentItems[navigation.activeIndex.value];

  if (!active || active.disabled) {
    navigation.activateFirst();
  }
}

function registerItem(item: DropdownRegisteredItem) {
  const index = registeredItems.value.findIndex((current) => current.uid === item.uid);

  if (index >= 0) {
    const nextItems = [...registeredItems.value];
    nextItems[index] = item;
    registeredItems.value = nextItems;
    return;
  }

  registeredItems.value = [...registeredItems.value, item];
}

function unregisterItem(uid: number) {
  registeredItems.value = registeredItems.value.filter((item) => item.uid !== uid);
}

function getItemIndex(uid: number) {
  return registeredItems.value.findIndex((item) => item.uid === uid);
}

function getItemTabIndex(uid: number) {
  const index = getItemIndex(uid);
  return navigation.activeIndex.value === index ? 0 : -1;
}

function isItemActive(uid: number) {
  return navigation.activeIndex.value === getItemIndex(uid);
}

function setActiveByUid(uid: number) {
  const index = getItemIndex(uid);

  if (index >= 0) {
    navigation.setActiveIndex(index);
  }
}

function handleItemPointerMove(uid: number) {
  setActiveByUid(uid);
}

function handleItemPointerLeave() {
  return;
}

function focusActiveItem() {
  if (navigation.activeIndex.value < 0) {
    menuRef.value?.focus();
    return;
  }

  const activeElement = menuRef.value?.querySelector<HTMLElement>(
    `[data-index="${navigation.activeIndex.value}"]`
  );
  activeElement?.focus();
}

function emitSelection(
  command: DropdownCommand | string | undefined,
  item: DropdownSelectItem | DropdownItem
) {
  emit("select", item);
  emit("command", command, item);
}

function commandHandler(
  command: DropdownCommand | string | undefined,
  item: DropdownSelectItem | DropdownItem
) {
  emitSelection(command, item);
}

function handleLegacySelect(item: DropdownItem) {
  if (item.disabled) {
    return;
  }

  commandHandler(item.command ?? item.key, item);

  if (hideOnClick.value) {
    handleClose({
      restoreFocus: true,
      immediate: true
    });
  }
}

function handleClose(options?: { restoreFocus?: boolean; immediate?: boolean }) {
  restoreFocusAfterClose.value = Boolean(options?.restoreFocus);
  closeFloating({
    immediate: options?.immediate ?? true
  });
}

async function openMenu(options?: { immediate?: boolean; focusMenu?: boolean; keyboard?: boolean }) {
  if (props.disabled || !hasMenuContent.value) {
    return;
  }

  if (options?.keyboard) {
    isUsingKeyboard.value = true;
  }

  shouldFocusAfterOpen.value = Boolean(options?.focusMenu);

  openFloating({
    immediate: options?.immediate ?? !isTriggerEnabled("hover")
  });
}

function scheduleOpen() {
  if (!isTriggerEnabled("hover")) {
    return;
  }

  void openMenu({
    immediate: false
  });
}

function scheduleClose() {
  if (!isTriggerEnabled("hover")) {
    return;
  }

  handleClose({
    immediate: false
  });
}

function handleTriggerClick() {
  if (!isTriggerEnabled("click")) {
    return;
  }

  isUsingKeyboard.value = false;
  toggle();
}

function handleContextMenu(event: MouseEvent) {
  if (!isTriggerEnabled("contextmenu")) {
    return;
  }

  event.preventDefault();
  internalVirtualRef.value = {
    getBoundingClientRect: () =>
      ({
        x: event.clientX,
        y: event.clientY,
        top: event.clientY,
        left: event.clientX,
        right: event.clientX,
        bottom: event.clientY,
        width: 0,
        height: 0,
        toJSON: () => ({})
      }) as DOMRect
  };

  void openMenu({
    immediate: true
  });
}

async function handleMenuKeydown(event: KeyboardEvent) {
  if (props.disabled) {
    return;
  }

  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      if (!visible.value) {
        await openMenu({
          immediate: true,
          focusMenu: true,
          keyboard: true
        });
      } else {
        navigation.moveNext();
        focusActiveItem();
      }
      break;
    case "ArrowUp":
      event.preventDefault();
      if (!visible.value) {
        await openMenu({
          immediate: true,
          focusMenu: true,
          keyboard: true
        });
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
    case "NumpadEnter":
    case " ":
      event.preventDefault();
      if (!visible.value) {
        await openMenu({
          immediate: true,
          focusMenu: true,
          keyboard: true
        });
        break;
      }

      if (isLegacyMode.value) {
        const item = props.items[navigation.activeIndex.value];
        if (item) {
          handleLegacySelect(item);
        }
        break;
      }

      activeRegisteredItem.value?.select(event);
      break;
    case "Escape":
      event.preventDefault();
      handleClose({
        restoreFocus: true,
        immediate: true
      });
      break;
    case "Tab":
      handleClose({
        restoreFocus: false,
        immediate: true
      });
      break;
    default:
      break;
  }
}

function handleTriggerKeydown(event: KeyboardEvent) {
  if (!triggerKeysSet.value.has(event.key)) {
    if (visible.value) {
      void handleMenuKeydown(event);
    }
    return;
  }

  void handleMenuKeydown(event);
}

function handleMainButtonClick(event: MouseEvent) {
  if (props.disabled) {
    event.preventDefault();
    return;
  }

  emit("click", event);
}

watch(visible, async (value) => {
  stopAutoUpdate();

  if (!value) {
    return;
  }

  await nextTick();
  syncNavigationOnOpen();
  await updatePosition();
  startAutoUpdate();

  if (shouldFocusAfterOpen.value) {
    focusActiveItem();
    shouldFocusAfterOpen.value = false;
  }
});

useDismissibleLayer({
  enabled: () => visible.value,
  refs: [triggerRef, mainButtonRef, caretButtonRef, menuRef],
  closeOnEscape: true,
  closeOnOutside: true,
  isTopMost: () => isTopMost.value,
  onDismiss: () => {
    handleClose({
      immediate: true
    });
  }
});

provide(dropdownContextKey, {
  role: computed(() => props.role as DropdownRole),
  itemRole,
  triggerId,
  hideOnClick,
  isUsingKeyboard,
  loop: computed(() => props.loop),
  menuRef,
  registerItem,
  unregisterItem,
  getItemIndex,
  getItemTabIndex,
  isItemActive,
  setActiveByUid,
  focusActiveItem,
  handleMenuKeydown,
  handleItemPointerMove,
  handleItemPointerLeave,
  commandHandler,
  handleClose
});

onBeforeUnmount(() => {
  clearTimers();
  stopAutoUpdate();
  closeLayer();
});
</script>

<template>
  <span :class="rootClasses" :style="attrs.style">
    <template v-if="!props.splitButton">
      <span
        ref="triggerRef"
        class="xy-dropdown__trigger"
        role="button"
        :tabindex="props.disabled ? -1 : props.tabindex"
        :aria-expanded="visible"
        :aria-controls="listId"
        :aria-haspopup="props.role === 'menu' ? 'menu' : undefined"
        @click="handleTriggerClick"
        @contextmenu="handleContextMenu"
        @mouseenter="scheduleOpen"
        @mouseleave="scheduleClose"
        @keydown="handleTriggerKeydown"
      >
        <slot>
          <button type="button" class="xy-dropdown__default-trigger">更多操作</button>
        </slot>
      </span>
    </template>

    <template v-else>
      <XyButtonGroup class="xy-dropdown__split">
        <XyButton
          ref="mainButtonRef"
          v-bind="mainButtonProps"
          class="xy-dropdown__split-main"
          @click="handleMainButtonClick"
        >
          <slot>
            {{ fallbackTriggerText }}
          </slot>
        </XyButton>
        <XyButton
          ref="caretButtonRef"
          v-bind="mainButtonProps"
          class="xy-dropdown__caret-button"
          :aria-expanded="visible"
          :aria-controls="listId"
          :aria-haspopup="props.role === 'menu' ? 'menu' : undefined"
          :tabindex="props.disabled ? -1 : props.tabindex"
          @click="handleTriggerClick"
          @contextmenu="handleContextMenu"
          @mouseenter="scheduleOpen"
          @mouseleave="scheduleClose"
          @keydown="handleTriggerKeydown"
        >
          <XyIcon icon="mdi:chevron-down" :size="16" />
        </XyButton>
      </XyButtonGroup>
    </template>

    <teleport :to="teleportTarget" :disabled="!props.teleported">
      <transition name="xy-fade" @after-leave="handleAfterLeave">
        <div
          v-if="rendered"
          v-show="visible"
          ref="menuRef"
          :class="['xy-dropdown__panel', props.popperClass]"
          :data-placement="actualPlacement"
          :style="[floatingStyle, menuStyle, props.popperStyle]"
          @mouseenter="scheduleOpen"
          @mouseleave="scheduleClose"
        >
          <span
            v-if="props.showArrow"
            ref="arrowRef"
            class="xy-popper__arrow"
            :style="arrowStyle"
          />

          <template v-if="slots.dropdown">
            <slot name="dropdown" />
          </template>

          <template v-else>
            <XyDropdownMenu
              :id="listId"
              @keydown="handleMenuKeydown"
            >
              <XyDropdownItemImpl
                v-for="(item, index) in props.items"
                :id="`${listId}-item-${index}`"
                :key="item.key"
                :data-index="index"
                :role="itemRole"
                :active="navigation.activeIndex.value === index"
                :disabled="item.disabled"
                :divided="item.divided"
                :icon="item.icon"
                :danger="item.danger"
                :description="item.description"
                :text-value="item.textValue || item.label"
                :tabindex="navigation.activeIndex.value === index ? 0 : -1"
                @pointermove="navigation.setActiveIndex(index)"
                @focus="navigation.setActiveIndex(index)"
                @click="handleLegacySelect(item)"
              >
                {{ item.label }}
              </XyDropdownItemImpl>
            </XyDropdownMenu>
          </template>
        </div>
      </transition>
    </teleport>
  </span>
</template>
