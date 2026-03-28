<script setup lang="ts">
defineOptions({
  name: "XySubMenu"
});

import {
  computed,
  h,
  nextTick,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  shallowRef,
  watch
} from "vue";
import type { Component, StyleValue, VNode } from "vue";
import { useFloatingPanel, useNamespace } from "@xiaoye/composables";
import XyIcon from "../../icon";
import XyMenuCollapseTransition from "./menu-collapse-transition.vue";
import { subMenuContextKey } from "./tokens";
import type { MenuIcon, SubMenuProps } from "./sub-menu";
import type { InternalMenuNode } from "./types";
import { useMenu } from "./use-menu";

const props = withDefaults(defineProps<SubMenuProps>(), {
  popperClass: "",
  popperStyle: undefined,
  showTimeout: undefined,
  hideTimeout: undefined,
  disabled: false,
  teleported: undefined,
  popperOffset: undefined,
  expandCloseIcon: undefined,
  expandOpenIcon: undefined,
  collapseCloseIcon: undefined,
  collapseOpenIcon: undefined
});
const nsMenu = useNamespace("menu");
const nsSubMenu = useNamespace("sub-menu");
const triggerRef = ref<HTMLDivElement | null>(null);
const popupRef = ref<HTMLElement | null>(null);
const rendered = ref(false);
const items = shallowRef<Record<string, InternalMenuNode>>({});
const subMenus = shallowRef<Record<string, InternalMenuNode>>({});
const openTimer = ref<number | null>(null);
const closeTimer = ref<number | null>(null);

const { rootMenu, parentSubMenu, indexPath, level } = useMenu(() => props.index);

if (!rootMenu) {
  throw new Error("[XySubMenu] sub-menu 必须在 xy-menu 内使用");
}

const menuRoot = rootMenu;

const popupMode = computed(
  () => menuRoot.props.mode === "horizontal" || (menuRoot.props.mode === "vertical" && menuRoot.props.collapse)
);
const opened = computed(() => menuRoot.openedMenus.value.includes(props.index));
const active = computed(
  () =>
    Object.values(items.value).some((item) => item.active.value) ||
    Object.values(subMenus.value).some((item) => item.active.value)
);
const isFirstLevel = computed(() => level.value === 0);
const appendToBody = computed(() => {
  if (props.teleported !== undefined) {
    return props.teleported;
  }

  return isFirstLevel.value;
});
const popupPlacement = computed(() =>
  menuRoot.props.mode === "horizontal" && isFirstLevel.value ? "bottom-start" : "right-start"
);
const popupOffset = computed(() => props.popperOffset ?? menuRoot.props.popperOffset);
const popupClass = computed(() => props.popperClass || menuRoot.props.popperClass || "");
const popupStyle = computed<StyleValue>(() => props.popperStyle ?? menuRoot.props.popperStyle);
const popupEffect = computed(() => menuRoot.props.popperEffect || "dark");
const subMenuState = {
  index: props.index,
  indexPath,
  active,
  disabled: props.disabled
};
const subMenuClasses = computed(() => [
  nsSubMenu.base.value,
  {
    "is-opened": opened.value,
    "is-active": active.value,
    "is-disabled": props.disabled,
    "is-popup": popupMode.value
  }
]);
const titleClasses = computed(() => [`${nsSubMenu.base.value}__title`]);
const menuClasses = computed(() => [
  `${nsMenu.base.value}__popup`,
  `${nsMenu.base.value}__popup--${popupEffect.value}`,
  popupClass.value
]);

const { floatingStyle, updatePosition, startAutoUpdate, stopAutoUpdate } = useFloatingPanel(
  triggerRef,
  popupRef,
  {
    placement: () => popupPlacement.value,
    strategy: "fixed",
    offset: () => popupOffset.value ?? 0,
    zIndex: 2000
  }
);

const iconComponent = computed<MenuIcon>(() => {
  const expandedMode =
    (menuRoot.props.mode === "horizontal" && isFirstLevel.value) ||
    (menuRoot.props.mode === "vertical" && !menuRoot.props.collapse);

  if (expandedMode) {
    if (props.expandCloseIcon && props.expandOpenIcon) {
      return opened.value ? props.expandOpenIcon : props.expandCloseIcon;
    }

    return "mdi:chevron-down";
  }

  if (props.collapseCloseIcon && props.collapseOpenIcon) {
    return opened.value ? props.collapseOpenIcon : props.collapseCloseIcon;
  }

  return "mdi:chevron-right";
});

function renderIcon(icon: MenuIcon | undefined, size = 16): VNode | null {
  if (!icon) {
    return null;
  }

  if (typeof icon === "string") {
    return h(XyIcon, {
      icon,
      size
    });
  }

  return h(icon as Component);
}

function clearOpenTimer() {
  if (openTimer.value != null) {
    window.clearTimeout(openTimer.value);
    openTimer.value = null;
  }
}

function clearCloseTimer() {
  if (closeTimer.value != null) {
    window.clearTimeout(closeTimer.value);
    closeTimer.value = null;
  }
}

function keepAlive() {
  clearCloseTimer();
  parentSubMenu?.keepAlive();
}

function addMenuItem(item: InternalMenuNode) {
  items.value = {
    ...items.value,
    [item.index]: item
  };
}

function removeMenuItem(index: string) {
  const nextItems = { ...items.value };
  delete nextItems[index];
  items.value = nextItems;
}

function addSubMenu(item: InternalMenuNode) {
  subMenus.value = {
    ...subMenus.value,
    [item.index]: item
  };
}

function removeSubMenu(index: string) {
  const nextMenus = { ...subMenus.value };
  delete nextMenus[index];
  subMenus.value = nextMenus;
}

function openMenuWithDelay() {
  clearOpenTimer();
  clearCloseTimer();

  if (props.disabled) {
    return;
  }

  if (!popupMode.value) {
    menuRoot.openMenu(props.index, indexPath.value);
    return;
  }

  const delay =
    props.showTimeout ?? (menuRoot.props.mode === "horizontal" ? menuRoot.props.showTimeout : 80);

  openTimer.value = window.setTimeout(() => {
    menuRoot.openMenu(props.index, indexPath.value);
  }, delay);
}

function closeMenuWithDelay() {
  clearOpenTimer();
  clearCloseTimer();

  if (!popupMode.value) {
    return;
  }

  const delay =
    props.hideTimeout ?? (menuRoot.props.mode === "horizontal" ? menuRoot.props.hideTimeout : 120);

  closeTimer.value = window.setTimeout(() => {
    menuRoot.closeMenu(props.index, indexPath.value);
  }, delay);
}

function handleClick() {
  if (props.disabled) {
    return;
  }

  if (popupMode.value && menuRoot.props.mode === "horizontal" && menuRoot.props.menuTrigger === "hover") {
    return;
  }

  if (opened.value) {
    menuRoot.closeMenu(props.index, indexPath.value);
    return;
  }

  menuRoot.openMenu(props.index, indexPath.value);
}

function handleKeydown(event: KeyboardEvent) {
  if (props.disabled) {
    return;
  }

  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }

  event.preventDefault();
  handleClick();
}

watch(
  opened,
  async (value) => {
    clearOpenTimer();
    clearCloseTimer();

    if (value) {
      rendered.value = true;

      if (popupMode.value) {
        await nextTick();

        if (popupRef.value) {
          menuRoot.registerPopupElement(popupRef.value);
        }

        await updatePosition();
        startAutoUpdate();
      }

      return;
    }

    if (popupRef.value) {
      menuRoot.unregisterPopupElement(popupRef.value);
    }

    stopAutoUpdate();

    if (!menuRoot.props.persistent) {
      rendered.value = false;
    }
  },
  {
    immediate: true
  }
);

watch(
  () => menuRoot.props.collapse,
  (value) => {
    if (value) {
      menuRoot.closeMenu(props.index, indexPath.value);
    }
  }
);

provide(subMenuContextKey, {
  indexPath,
  level: level.value + 1,
  addMenuItem,
  removeMenuItem,
  addSubMenu,
  removeSubMenu,
  keepAlive
});

onMounted(() => {
  parentSubMenu?.addSubMenu(subMenuState);
  menuRoot.addSubMenu(subMenuState);
});

onBeforeUnmount(() => {
  clearOpenTimer();
  clearCloseTimer();

  if (popupRef.value) {
    menuRoot.unregisterPopupElement(popupRef.value);
  }

  stopAutoUpdate();
  parentSubMenu?.removeSubMenu(props.index);
  menuRoot.removeSubMenu(props.index);
});
</script>

<template>
  <li
    :class="subMenuClasses"
    :data-index="props.index"
    @mouseenter="keepAlive(); popupMode ? openMenuWithDelay() : undefined"
    @mouseleave="popupMode ? closeMenuWithDelay() : undefined"
  >
    <div
      ref="triggerRef"
      :class="titleClasses"
      role="menuitem"
      tabindex="-1"
      @click="handleClick"
      @keydown="handleKeydown"
    >
      <div :class="`${nsSubMenu.base.value}__title-content`">
        <slot name="title" />
      </div>

      <span :class="`${nsSubMenu.base.value}__icon`">
        <component :is="{ render: () => renderIcon(iconComponent) }" />
      </span>
    </div>

    <template v-if="popupMode">
      <teleport to="body" :disabled="!appendToBody">
        <transition name="xy-fade">
          <ul
            v-if="rendered"
            v-show="opened"
            ref="popupRef"
            :class="menuClasses"
            :style="[floatingStyle, popupStyle]"
            role="menu"
            data-menu-popup="true"
            @mouseenter="keepAlive"
            @mouseleave="closeMenuWithDelay"
          >
            <slot />
          </ul>
        </transition>
      </teleport>
    </template>

    <xy-menu-collapse-transition v-else-if="menuRoot.props.collapseTransition">
      <ul v-show="opened" :class="`${nsSubMenu.base.value}__wrap`" role="menu">
        <slot />
      </ul>
    </xy-menu-collapse-transition>

    <ul v-else v-show="opened" :class="`${nsSubMenu.base.value}__wrap`" role="menu">
      <slot />
    </ul>
  </li>
</template>
